# Admin Dashboard Documentation

## Overview
The admin dashboard provides a centralized interface for managing users in the Brain Bot Docs application. It includes user statistics, a comprehensive user list, and the ability to create new users with all necessary metadata.

## Features

### User Statistics
- Total user count
- Breakdown by role (Admin, User, Viewer)
- Visual indicators with icons and colors

### User Management Table
- Email addresses with "You" indicator for current user
- Full names (first and last)
- Telegram integration (username and ID)
- Role badges with color coding
- Creation date

### User Creation
- Full user profile creation including:
  - First and Last Name (required)
  - Email (required, validated)
  - Password (required, min 6 characters)
  - Telegram ID (optional, numeric)
  - Telegram Username (optional)
  - Role selection (Admin/User/Viewer)

## Access Control

The admin dashboard is restricted to users with the `admin` role. Other users will be redirected if they attempt to access `/admin`.

## User Creation Methods

### Method 1: With Service Role Key (Recommended)
If you have configured the `VITE_SUPABASE_SERVICE_KEY` in your `.env` file, the dashboard can create users directly:

1. Click "Create New User"
2. Fill in all required fields
3. Click "Create User"
4. The user is created in Supabase Auth and their profile is populated

### Method 2: Without Service Role Key
If the service role key is not configured, you'll see a warning and must:

1. Click "Create New User"
2. Fill in the user details
3. You'll be prompted to create the user in Supabase first
4. Go to your Supabase Dashboard
5. Create the user with the provided email
6. Return and click OK to save their profile details

## Security Considerations

### Service Role Key
- The service role key has full database access
- It should NEVER be exposed in production client-side code
- Only use it in secure, admin-only contexts
- Consider implementing a backend API for user creation instead

### Alternative Approaches
For production, consider:
1. Backend API endpoint for user creation
2. Supabase Edge Functions for secure user management
3. Manual user creation through Supabase Dashboard

## Database Schema

The admin dashboard works with the extended `user_profiles` table:

```sql
user_profiles
- id (UUID, references auth.users)
- email (TEXT, unique)
- first_name (TEXT)
- last_name (TEXT)
- telegram_id (BIGINT, unique)
- telegram_username (TEXT)
- role (TEXT: admin/user/viewer)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## Role Permissions

| Role   | Admin Dashboard | User Management | Document Access |
|--------|----------------|-----------------|----------------|
| Admin  | ✅ Full Access  | ✅ Create/Edit  | ✅ Full Access  |
| User   | ❌ No Access    | ❌ View Only    | ✅ Read Only    |
| Viewer | ❌ No Access    | ❌ No Access    | ✅ Read Only    |

## Configuration

### Required Environment Variables
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Optional Environment Variables
```env
# For direct user creation from admin dashboard
VITE_SUPABASE_SERVICE_KEY=your-service-role-key
```

## Troubleshooting

### "Admin client not available" message
- This means the service role key is not configured
- Either add it to your `.env` file or use manual creation method

### User creation fails
- Check browser console for detailed error messages
- Verify email is not already in use
- Ensure password meets requirements (min 6 characters)
- Check that Telegram ID is numeric if provided

### Can't access admin dashboard
- Verify your user has `admin` role in user_profiles table
- Check browser console for permission errors
- Ensure you're logged in

## Best Practices

1. **Telegram Integration**: When creating users who will use the Telegram bot, always include their Telegram ID
2. **Role Assignment**: Start users as `viewer` and upgrade as needed
3. **Password Security**: Use strong passwords and encourage users to change them on first login
4. **Audit Trail**: Consider implementing logging for user creation/modification