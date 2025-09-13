# Authentication Setup Guide

## Overview
This application now includes a complete authentication system with role-based access control using Supabase Auth and Row Level Security (RLS).

## Backend Setup Required

### 1. Database Migration
Run the SQL migration located at `migrations/001_add_user_management.sql` in your Supabase dashboard:
- Go to the SQL Editor in your Supabase dashboard
- Copy and paste the entire migration file
- Execute the SQL

This will create:
- `user_profiles` table with roles (admin, user, viewer)
- RLS policies for secure access control
- Automatic profile creation on user signup
- Proper indexes for performance

### 2. Configure Environment Variables
**IMPORTANT**: Set up your environment variables:
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Go to your Supabase dashboard
3. Navigate to Settings > API
4. Copy your project URL and "anon" key (NOT the service role key)
5. Update the `.env` file with your values:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   VITE_APP_NAME=brain-bot-docs
   ```

### 3. Create Initial Users

**Option 1: Using Supabase Dashboard (Recommended)**
1. Go to [Authentication > Users](https://supabase.com/dashboard/project/thnwlykidzhrsagyjncc/auth/users) in Supabase dashboard
2. Click "Add user" → "Create new user"
3. Enter email and password for each user:
   - Colin Aulds: colin@10netzero.com (or appropriate email)
   - Joel Fulford: joel@10netzero.com (or appropriate email)
4. Users will automatically get admin role (as configured in the trigger)

**Option 2: Using Supabase Auth API**
```javascript
// Example using supabase-js
const { data, error } = await supabaseClient.auth.admin.createUser({
  email: 'user@example.com',
  password: 'secure-password',
  email_confirm: true
})
```

**Note**: All new users are automatically assigned 'admin' role by the trigger. To change a user's role:
```sql
UPDATE public.user_profiles 
SET role = 'viewer'  -- or 'user' or 'admin'
WHERE email = 'user@example.com';
```

## Frontend Features

### Authentication Flow
- Login page at `/login`
- Protected routes require authentication
- Automatic redirect to login if not authenticated
- Session persistence across page refreshes

### Role-Based Access Control

#### Viewer Role (default)
- Can view documents
- Cannot create or edit anything
- Cannot access user management

#### User Role
- Can view and create documents
- Can view user list
- Cannot edit users or delete documents

#### Admin Role
- Full access to all features
- Can manage users (view, edit roles)
- Can create, edit, and delete documents

### Components Created

1. **Auth Provider** (`src/providers/authProvider.ts`)
   - Handles login/logout
   - Session management
   - User identity

2. **Access Control Provider** (`src/providers/accessControlProvider.ts`)
   - Role-based permissions
   - UI element visibility control

3. **Login Page** (`src/pages/login/index.tsx`)
   - Email/password authentication
   - Error handling
   - Responsive design

4. **User Management Pages**
   - List: View all users with roles
   - Show: View user details
   - Edit: Change user roles (admin only)

## Testing the Implementation

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Test authentication**:
   - Try accessing the app without logging in
   - Should redirect to `/login`
   - Login with valid credentials
   - Should redirect to documents list

3. **Test role permissions**:
   - Login as viewer: Should only see documents (read-only)
   - Login as user: Should see create button on documents
   - Login as admin: Should see Users menu and all actions

4. **Test RLS policies**:
   - Open browser console
   - Try to manually query protected data
   - Should get permission errors for unauthorized actions

## Troubleshooting

### Common Issues

1. **"Invalid API key" error**
   - Make sure you're using the anon key, not service role
   - Check that the key is correctly copied

2. **Users can't login**
   - Verify users exist in Supabase Auth
   - Check that user_profiles entry was created
   - Look for errors in browser console

3. **Permission denied errors**
   - Check RLS policies are enabled
   - Verify user has correct role in user_profiles
   - Ensure policies were created successfully

4. **Missing user profile**
   - The trigger should auto-create profiles
   - If missing, manually insert into user_profiles table

## Security Notes

- Never expose service role key in frontend code
- Always use RLS for database security
- Validate permissions on both frontend and backend
- Keep authentication tokens secure
- Use HTTPS in production

## Next Steps

1. Add password reset functionality
2. Implement OAuth providers (Google, GitHub)
3. Add user registration flow
4. Create audit logs for sensitive actions
5. Add two-factor authentication