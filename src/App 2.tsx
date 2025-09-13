import { Authenticated, CanAccess, Refine } from "@refinedev/core";
import { ThemedLayoutV2 } from "@refinedev/antd";
import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import { dataProvider, liveProvider } from "@refinedev/supabase";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { ConfigProvider } from "antd";
import "@refinedev/antd/dist/reset.css";

import { authProvider } from "./providers/authProvider";
import { accessControlProvider } from "./providers/accessControlProvider";
import { supabaseClient } from "./utils/supabaseClient";
import { LoginPage } from "./features/auth/login";
import { SignupPage } from "./features/auth/signup";
import { DocumentList } from "./features/documents";
import { UserList, UserShow, UserEdit } from "./features/users";
import { AdminDashboard } from "./features/admin";
import { ProfilePage } from "./features/profile";
import { Homepage } from "./features/homepage";
import { CustomHeader } from "./components/header";

function App() {
  console.log('[BBUI] App component rendering...');
  console.log('[BBUI] Auth provider:', authProvider);
  console.log('[BBUI] Supabase client:', supabaseClient);
  
  // Temporary debug mode
  const debugMode = false;
  
  if (debugMode) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h1>BBUI App is Loading!</h1>
        <p>If you see this, the React app is working.</p>
        <p>Environment: {import.meta.env.MODE}</p>
        <p>Supabase URL: {import.meta.env.VITE_SUPABASE_URL}</p>
      </div>
    );
  }
  
  return (
    <BrowserRouter>
      <ConfigProvider>
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
              meta: {
                label: "Documents",
              },
            },
            {
              name: "personnel",
              list: "/personnel",
              show: "/personnel/:id",
              edit: "/personnel/:id/edit",
              meta: {
                label: "Personnel",
                hide: true, // Hide from sidebar - only accessible to admins via routes
              },
            },
            {
              name: "admin",
              list: "/admin",
              meta: {
                label: "Admin Dashboard",
                icon: "🛡️",
                canDelete: false,
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
                  <ThemedLayoutV2 Header={CustomHeader}>
                    <Outlet />
                  </ThemedLayoutV2>
                </Authenticated>
              }
            >
              {/* Protected routes */}
              <Route index element={<Homepage />} />
              <Route path="/documents">
                <Route index element={<DocumentList />} />
                <Route path=":id" element={<DocumentList />} />
              </Route>
              <Route path="/personnel">
                <Route index element={<UserList />} />
                <Route path=":id" element={<UserShow />} />
                <Route path=":id/edit" element={<UserEdit />} />
              </Route>
              <Route path="/admin">
                <Route
                  index
                  element={
                    <CanAccess resource="admin" action="list" fallback={<CatchAllNavigate to="/" />}>
                      <AdminDashboard />
                    </CanAccess>
                  }
                />
              </Route>
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
            <Route
              element={
                <Authenticated key="authenticated-outer" fallback={<Outlet />}>
                  <CatchAllNavigate to="/" />
                </Authenticated>
              }
            >
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
            </Route>
          </Routes>

          <DocumentTitleHandler />
          <UnsavedChangesNotifier />
        </Refine>
      </ConfigProvider>
    </BrowserRouter>
  );
}

export default App;
