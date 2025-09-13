# Agent Handoff Document - BBUI Project

## Project Status: Database Consolidation Complete ✅

### What Was Just Completed
We successfully consolidated three separate user tables into a single `personnel` table:
- ~~`user_profiles`~~ → Migrated to `personnel`
- ~~`flrts_users`~~ → Migrated to `personnel` 
- `personnel` → Now the single source of truth for all users

### Current Architecture

#### Database Structure
**Main User Table: `personnel`**
```sql
- id (UUID)
- personnel_id_display (VARCHAR)
- first_name, last_name (VARCHAR)
- email (VARCHAR)
- phone_number (VARCHAR)
- job_title (VARCHAR)
- personnel_type (VARCHAR) - Values: 'Employee', 'Contractor', 'Intern', 'Advisor'
- primary_site_id (UUID)
- is_active (BOOLEAN)
- emergency_contact_name/phone (VARCHAR)
- profile_photo_url (VARCHAR)
- auth_user_id (UUID) - Links to auth.users
- app_role (TEXT) - Values: 'admin', 'user', 'viewer'
- telegram_id, telegram_username (TEXT)
- timezone (TEXT)
- flrts_permissions (JSONB)
- preferences (JSONB)
```

#### Authentication Flow
1. User signs in with Google OAuth (@10netzero.com emails only)
2. Trigger automatically creates/updates `personnel` record
3. @10netzero.com emails get 'admin' role by default
4. Non-@10netzero.com emails get 'viewer' role

#### UI Components Updated
- ✅ Auth Provider → Uses `personnel` table
- ✅ Access Control Provider → Uses `personnel` table
- ✅ Profile Page → Users edit their own info
- ✅ Personnel Management → Admin-only pages
- ✅ Routes changed from `/users` to `/personnel`

### What Still Needs to Be Done

#### 1. Deploy Updated Code
```bash
npm run deploy
```
The code has been updated but needs deployment to production.

#### 2. Clean Up Old Tables (After Verification)
Once everything is working in production:
```sql
DROP TABLE public.user_profiles CASCADE;
DROP TABLE public.flrts_users CASCADE;
```

#### 3. Update Personnel ID Display
Currently using temporary IDs like "TEMP-xxxxx". Need to:
- Create a proper ID generation system
- Update existing temporary IDs

#### 4. Profile Page Navigation
Users need to:
- Click their name/avatar in top right
- Select "Profile Settings" from dropdown
- The URL is `/profile`

#### 5. Admin Features
Admins can access personnel management at `/personnel` but it's hidden from the sidebar for non-admins.

### Known Issues & Solutions

#### Issue: "Service role key not configured" warning
**Solution**: This can be ignored. Users are created through Supabase Auth, not directly.

#### Issue: Personnel type constraint
**Solution**: Use capitalized values: 'Employee', 'Contractor', 'Intern', 'Advisor'

#### Issue: Missing profile dropdown
**Solution**: Make sure user has a personnel record. The migration should have created one.

### File Locations
- **Migrations**: `/migrations/` (especially 006_consolidate_to_personnel.sql)
- **Auth Logic**: `/src/providers/authProvider.ts`
- **Profile Page**: `/src/features/profile/index.tsx`
- **Personnel Pages**: `/src/features/users/` (manages personnel)
- **Main App Routes**: `/src/App.tsx`

### Testing Checklist
- [ ] Google OAuth login works
- [ ] Profile page accessible and editable
- [ ] Admin can see Personnel menu
- [ ] Non-admins cannot see Personnel menu
- [ ] Document viewer works
- [ ] All user data displays correctly

### Environment
- **Database**: Supabase (project: thnwlykidzhrsagyjncc)
- **Frontend**: React + Refine + Ant Design
- **Deployment**: Cloudflare Pages (10nz.tools)
- **Auth**: Supabase Auth with Google OAuth

### Next Features to Consider
1. FLRTS integration (Field Reports, Lists, Reminders, Tasks, Sub-tasks)
2. Personnel photo uploads
3. Site assignment management
4. Emergency contact management
5. Activity/audit logging

### Important Notes
- All @10netzero.com emails are automatically admins
- The `personnel` table is the ONLY user table now
- RLS policies use the `is_admin()` helper function
- The app is designed for 10NetZero employees primarily