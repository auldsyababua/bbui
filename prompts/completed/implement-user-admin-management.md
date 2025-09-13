# Task: Implement User/Admin Management System for BBUI

## Objective
Implement a simple yet effective user management system with role-based access control using Refine's built-in Supabase integration and Supabase's native authentication and Row Level Security (RLS).

## Context
BBUI needs user management to control who can view documents in the brain-bot system. We want the **simplest** approach that:
- Leverages Supabase's built-in auth system
- Uses Supabase Row Level Security (RLS) for permissions
- Integrates seamlessly with Refine's authProvider
- Supports basic roles: admin, user, viewer

## Requirements

### 1. Database Setup
Create the following tables in Supabase:

```sql
-- User profiles table (extends Supabase auth.users)
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('admin', 'user', 'viewer')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON public.user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can update any profile
CREATE POLICY "Admins can update profiles" ON public.user_profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Update brain_bot_documents RLS policies
-- Viewers can only read
CREATE POLICY "Viewers can read documents" ON public.brain_bot_documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role IN ('admin', 'user', 'viewer')
    )
  );

-- Users can read and create
CREATE POLICY "Users can create documents" ON public.brain_bot_documents
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role IN ('admin', 'user')
    )
  );

-- Admins can do everything
CREATE POLICY "Admins have full access" ON public.brain_bot_documents
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### 2. Refine AuthProvider Implementation
Create `src/providers/authProvider.ts`:

```typescript
import { AuthProvider } from "@refinedev/core";
import { supabaseClient } from "../utility/supabaseClient";

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        success: false,
        error,
      };
    }

    if (data?.user) {
      return {
        success: true,
        redirectTo: "/",
      };
    }

    return {
      success: false,
      error: {
        message: "Login failed",
        name: "Invalid email or password",
      },
    };
  },
  
  logout: async () => {
    const { error } = await supabaseClient.auth.signOut();
    
    if (error) {
      return {
        success: false,
        error,
      };
    }

    return {
      success: true,
      redirectTo: "/login",
    };
  },
  
  check: async () => {
    const { data } = await supabaseClient.auth.getSession();
    const { session } = data;

    if (session) {
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      redirectTo: "/login",
    };
  },
  
  getPermissions: async () => {
    const { data: { user } } = await supabaseClient.auth.getUser();
    
    if (!user) return null;

    // Get user role from profile
    const { data: profile } = await supabaseClient
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    return profile?.role || 'viewer';
  },
  
  getIdentity: async () => {
    const { data: { user } } = await supabaseClient.auth.getUser();
    
    if (!user) return null;

    // Get full profile
    const { data: profile } = await supabaseClient
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    return {
      id: user.id,
      name: profile?.full_name || user.email,
      email: user.email,
      role: profile?.role || 'viewer',
    };
  },
  
  onError: async (error) => {
    console.error(error);
    return { error };
  },
};
```

### 3. Access Control Provider
Create `src/providers/accessControlProvider.ts`:

```typescript
import { AccessControlProvider } from "@refinedev/core";
import { supabaseClient } from "../utility/supabaseClient";

type Role = 'admin' | 'user' | 'viewer';

// Define permissions matrix
const permissions: Record<Role, {
  resources: Record<string, string[]>;
}> = {
  admin: {
    resources: {
      brain_bot_documents: ['list', 'show', 'create', 'edit', 'delete'],
      user_profiles: ['list', 'show', 'create', 'edit', 'delete'],
    },
  },
  user: {
    resources: {
      brain_bot_documents: ['list', 'show', 'create'],
      user_profiles: ['list', 'show'],
    },
  },
  viewer: {
    resources: {
      brain_bot_documents: ['list', 'show'],
      user_profiles: [],
    },
  },
};

export const accessControlProvider: AccessControlProvider = {
  can: async ({ resource, action }) => {
    const { data: { user } } = await supabaseClient.auth.getUser();
    
    if (!user) {
      return { can: false };
    }

    // Get user role
    const { data: profile } = await supabaseClient
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const role = (profile?.role || 'viewer') as Role;
    const rolePermissions = permissions[role];
    
    if (!rolePermissions) {
      return { can: false };
    }

    const resourcePermissions = rolePermissions.resources[resource] || [];
    const can = resourcePermissions.includes(action);

    return { can };
  },
};
```

### 4. Login Component
Create `src/pages/login/index.tsx`:

```typescript
import { useLogin } from "@refinedev/core";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

const { Title } = Typography;

export const LoginPage = () => {
  const { mutate: login, isLoading } = useLogin();

  const onFinish = (values: { email: string; password: string }) => {
    login(values, {
      onError: (error) => {
        message.error(error?.message || "Login failed");
      },
    });
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "#f0f2f5",
    }}>
      <Card style={{ width: 400 }}>
        <Title level={2} style={{ textAlign: "center" }}>
          Brain Bot Documents
        </Title>
        <Form
          name="login"
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="email@example.com"
              size="large"
            />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              block
              size="large"
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
```

### 5. Update App.tsx
Modify the main App component to include authentication:

```typescript
import { Authenticated, Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import { dataProvider, liveProvider } from "@refinedev/supabase";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";

import { authProvider } from "./providers/authProvider";
import { accessControlProvider } from "./providers/accessControlProvider";
import { supabaseClient } from "./utility/supabaseClient";
import { LoginPage } from "./pages/login";
// ... other imports

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <Refine
          dataProvider={dataProvider(supabaseClient)}
          liveProvider={liveProvider(supabaseClient)}
          authProvider={authProvider}
          accessControlProvider={accessControlProvider}
          routerProvider={routerBindings}
          resources={[
            {
              name: "brain_bot_documents",
              list: "/documents",
              show: "/documents/:id",
              // Only show create/edit for users with permission
              create: "/documents/create",
              edit: "/documents/:id/edit",
              meta: {
                canDelete: true,
              },
            },
            {
              name: "user_profiles",
              list: "/users",
              show: "/users/:id",
              edit: "/users/:id/edit",
              meta: {
                label: "Users",
              },
            },
          ]}
          options={{
            syncWithLocation: true,
            warnWhenUnsavedChanges: true,
          }}
        >
          <Routes>
            <Route
              element={
                <Authenticated
                  key="authenticated-inner"
                  fallback={<CatchAllNavigate to="/login" />}
                >
                  <ThemedLayoutV2>
                    <Outlet />
                  </ThemedLayoutV2>
                </Authenticated>
              }
            >
              {/* Protected routes */}
              <Route index element={<NavigateToResource resource="brain_bot_documents" />} />
              <Route path="/documents">
                <Route index element={<DocumentList />} />
                <Route path=":id" element={<DocumentShow />} />
                <Route path="create" element={<DocumentCreate />} />
                <Route path=":id/edit" element={<DocumentEdit />} />
              </Route>
              <Route path="/users">
                <Route index element={<UserList />} />
                <Route path=":id" element={<UserShow />} />
                <Route path=":id/edit" element={<UserEdit />} />
              </Route>
            </Route>
            <Route
              element={
                <Authenticated key="authenticated-outer" fallback={<Outlet />}>
                  <NavigateToResource />
                </Authenticated>
              }
            >
              <Route path="/login" element={<LoginPage />} />
            </Route>
          </Routes>

          <RefineKbar />
          <UnsavedChangesNotifier />
          <DocumentTitleHandler />
        </Refine>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}
```

### 6. Create User Management Pages
Create basic user list page at `src/pages/users/list.tsx`:

```typescript
import { List, Table, Space, Tag, useTable, CanAccess } from "@refinedev/antd";
import { BaseRecord } from "@refinedev/core";

const roleColors = {
  admin: "red",
  user: "blue",
  viewer: "green",
};

export const UserList = () => {
  const { tableProps } = useTable({
    resource: "user_profiles",
  });

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="email" title="Email" />
        <Table.Column dataIndex="full_name" title="Name" />
        <Table.Column
          dataIndex="role"
          title="Role"
          render={(role: string) => (
            <Tag color={roleColors[role as keyof typeof roleColors]}>
              {role.toUpperCase()}
            </Tag>
          )}
        />
        <Table.Column
          dataIndex="created_at"
          title="Created"
          render={(value: string) => new Date(value).toLocaleDateString()}
        />
        <Table.Column
          title="Actions"
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Space>
              <CanAccess
                resource="user_profiles"
                action="edit"
                params={{ id: record.id }}
              >
                <EditButton hideText size="small" recordItemId={record.id} />
              </CanAccess>
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
```

## Success Criteria
- [ ] Supabase authentication working with email/password
- [ ] User profiles table created with RLS policies
- [ ] Role-based access control working (admin/user/viewer)
- [ ] Login page functional and styled
- [ ] Documents only accessible to authenticated users
- [ ] Admins can manage users, others cannot
- [ ] All TypeScript types properly defined
- [ ] No console errors or warnings

## Technical Notes
- This uses Supabase's built-in auth, which is the simplest approach
- RLS policies handle permissions at the database level for security
- The accessControlProvider handles UI-level permissions (hiding buttons, etc.)
- No need for external libraries like Casbin - Supabase RLS is sufficient
- User creation can be done through Supabase dashboard initially

## Testing Instructions
1. Apply the SQL migrations to create tables and policies
2. Create test users in Supabase Auth dashboard with different roles
3. Test login with each role
4. Verify permissions work correctly for each role
5. Check that RLS policies prevent unauthorized access

## Files to Create/Modify
- `src/providers/authProvider.ts` (new)
- `src/providers/accessControlProvider.ts` (new)
- `src/pages/login/index.tsx` (new)
- `src/pages/users/list.tsx` (new)
- `src/pages/users/show.tsx` (new)
- `src/pages/users/edit.tsx` (new)
- `src/App.tsx` (modify)
- `src/utility/supabaseClient.ts` (ensure exists)

## Future Enhancements
- Add user registration flow
- Implement password reset
- Add OAuth providers (Google, GitHub)
- Create user invitation system for admins
- Add audit logging for sensitive actions