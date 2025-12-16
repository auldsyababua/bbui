# Google OAuth Setup Guide for BBUI

## Overview
This guide walks you through setting up Google OAuth authentication for the BBUI application using Supabase.

## Prerequisites
- Access to Supabase Dashboard
- Access to Google Cloud Console
- Admin rights for 10netzero.com Google Workspace (if restricting to domain)

## Step 1: Configure Google OAuth in Supabase

### 1.1 Get OAuth Credentials from Google
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API:
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click and Enable it
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client ID"
   - Choose "Web application"
   - Add authorized redirect URIs:
     ```
     https://<your-project-ref>.supabase.co/auth/v1/callback
     ```
   - Copy the Client ID and Client Secret

### 1.2 Configure in Supabase
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to Authentication → Providers
3. Find Google and click "Enable"
4. Enter your Google OAuth credentials:
   - Client ID: (from Google Cloud Console)
   - Client Secret: (from Google Cloud Console)
5. Save the configuration

### 1.3 (Optional) Restrict to 10netzero.com Domain
To only allow @10netzero.com emails:
1. In Supabase Dashboard, go to Authentication → Providers → Google
2. Add to "Authorized Client IDs" field:
   ```
   hd=10netzero.com
   ```
3. Or handle domain restriction in your auth flow (see code below)

## Step 2: Update Application Code

The login page has already been updated with Google OAuth support. The button will now work once Supabase is configured.

### Additional Domain Restriction (if needed)
If you want to enforce @10netzero.com emails in the application:

```typescript
// In authProvider.ts, add after successful login:
const { data: { user } } = await supabaseClient.auth.getUser();
if (user && !user.email?.endsWith('@10netzero.com')) {
  await supabaseClient.auth.signOut();
  return {
    success: false,
    error: {
      message: "Only @10netzero.com email addresses are allowed",
      name: "Invalid email domain",
    },
  };
}
```

## Step 3: Update Database Trigger

The existing trigger in `migrations/001_add_user_management.sql` should already handle Google OAuth users. It creates a user profile automatically when a new user signs up.

## Step 4: Test the Implementation

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the login page
3. Click "Sign in with Google"
4. You should be redirected to Google's OAuth consent screen
5. After successful authentication, you'll be redirected back to the app

## Step 5: Production Considerations

### Update Redirect URLs
For production deployment, add your production URL to:
1. Google Cloud Console → OAuth 2.0 Client → Authorized redirect URIs
2. Supabase Dashboard → Authentication → URL Configuration → Site URL

### Environment Variables
No additional environment variables needed - Supabase handles the OAuth configuration.

## Troubleshooting

### "Redirect URI mismatch" Error
- Check that the redirect URI in Google Console matches exactly:
  ```
  https://<your-project-ref>.supabase.co/auth/v1/callback
  ```
- Note: It must be HTTPS and include `/auth/v1/callback`

### Users Not Getting Correct Role
- Check the trigger is working:
  ```sql
  SELECT * FROM user_profiles WHERE email = 'user@10netzero.com';
  ```
- If missing, the trigger might need to be recreated

### "Invalid client" Error
- Double-check Client ID and Secret are correctly copied
- Ensure Google+ API is enabled in Google Cloud Console

### Domain Restriction Not Working
- Google OAuth doesn't enforce domain restrictions by default
- Implement application-level checking as shown above
- Consider using Google Workspace hosted domain parameter

## Security Notes

- The Google OAuth flow is handled entirely by Supabase
- No client secrets are exposed in the frontend
- User sessions are managed by Supabase Auth
- Always validate user domains if restricting access

## Next Steps

1. Add loading states during OAuth redirect
2. Implement error handling for OAuth failures
3. Add user profile completion flow for new OAuth users
4. Consider adding other OAuth providers (GitHub, Microsoft)