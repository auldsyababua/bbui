# BBUI Authentication Handoff Document

## Current State

### What's Built
1. **Supabase Authentication** with email/password
2. **Row Level Security (RLS)** policies on all tables
3. **Role-based access control** (admin, user, viewer)
4. **User management interface** for admins
5. **Email domain restriction** to @10netzero.com
6. **Deployment to Cloudflare Pages** at 10nz.tools

### The Problem
- Currently using email/password authentication
- You want Google OAuth to match your existing Cloudflare Access setup
- Concerned about dual authentication (Cloudflare Access + Supabase Auth)

## Authentication Architecture Options

### Option 1: Google OAuth with Supabase (Recommended)
**Pros:**
- Single authentication system
- Leverages Google's domain restriction
- Integrates with your database
- No dual login screens

**Cons:**
- Need to migrate from email/password to OAuth
- Need to configure Google OAuth in Supabase

### Option 2: Keep Current Setup
**Pros:**
- Already working
- Domain restriction in place

**Cons:**
- Users need passwords
- Not integrated with your existing Google auth

## To Complete Google OAuth Integration

### 1. Configure Google OAuth in Supabase Dashboard
```
Supabase Dashboard → Authentication → Providers → Google
- Enable Google provider
- Add your Google OAuth credentials
- Set authorized redirect URLs
```

### 2. Update Login Page
Replace email/password form with Google Sign-In button:
```typescript
// In src/pages/login/index.tsx
const { data, error } = await supabaseClient.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${window.location.origin}/`,
    queryParams: {
      hd: '10netzero.com' // Restrict to your domain
    }
  }
});
```

### 3. Handle User Profile Creation
Create a database function to sync Google users:
```sql
-- This trigger already exists but needs updating
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, role, first_name, last_name)
  VALUES (
    NEW.id, 
    NEW.email, 
    'admin',
    SPLIT_PART(NEW.raw_user_meta_data->>'full_name', ' ', 1),
    SPLIT_PART(NEW.raw_user_meta_data->>'full_name', ' ', 2)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 4. Remove Cloudflare Access
Since Supabase will handle auth:
- Remove Google Auth from Cloudflare Access for 10nz.tools
- Let Supabase handle all authentication

## Deployment Configuration

### Environment Variables Needed in Cloudflare Pages
- `VITE_SUPABASE_URL`: https://thnwlykidzhrsagyjncc.supabase.co
- `VITE_SUPABASE_ANON_KEY`: [your anon key]
- `VITE_APP_NAME`: brain-bot-docs

### Files Already Created
- `wrangler.toml` - Configured for 10nz-tools project
- `public/_headers` - Security headers
- `public/_redirects` - SPA routing
- `.dev.vars` - Local environment variables

## Testing Steps

1. **Remove your test email**:
   ```sql
   -- Run in Supabase SQL editor
   DELETE FROM auth.users WHERE email = 'colin@10netzero.com';
   ```

2. **Test Google OAuth flow**:
   - Click "Sign in with Google"
   - Use your @10netzero.com Google account
   - Verify profile created with correct data

3. **Test Telegram fields**:
   - Go to your profile
   - Add Telegram ID and username
   - Verify they save correctly

## Quick Commands

```bash
# Local development
cd brain-bot-docs-app
npm run dev

# Deploy to 10nz.tools
npm run deploy

# Test with Wrangler locally
npm run build
npm run pages:dev
```

## Database Access

To make direct database changes:
1. Use Supabase MCP tools in this conversation
2. Or use Supabase Dashboard SQL editor
3. Service role key is in your 1Password if needed

## Next Steps Priority

1. ✅ Configure Google OAuth in Supabase
2. ✅ Update login page to use Google Sign-In
3. ✅ Test the flow with a @10netzero.com account
4. ✅ Remove Cloudflare Access from 10nz.tools
5. ✅ Add any missing Telegram data to profiles

## Questions to Resolve

1. **Service Role Key**: Do you want the admin dashboard to create users directly, or just prepare them for manual creation in Supabase?
2. **Telegram Bot Integration**: How should the Telegram bot verify users against this system?
3. **Migration**: Do you need to migrate existing users from the Telegram bot?
