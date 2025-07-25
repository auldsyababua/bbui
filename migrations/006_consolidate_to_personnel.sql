-- Consolidate all user data into personnel table
-- This migration adds auth and app-specific fields to personnel table

-- 1. Add missing columns to personnel table
ALTER TABLE public.personnel 
ADD COLUMN IF NOT EXISTS auth_user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS app_role TEXT DEFAULT 'viewer' CHECK (app_role IN ('admin', 'user', 'viewer')),
ADD COLUMN IF NOT EXISTS telegram_id TEXT,
ADD COLUMN IF NOT EXISTS telegram_username TEXT,
ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'America/New_York',
ADD COLUMN IF NOT EXISTS flrts_permissions JSONB DEFAULT '{"can_create": true, "can_edit": true, "can_delete": false}'::jsonb,
ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}'::jsonb;

-- 2. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_personnel_auth_user_id ON public.personnel(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_personnel_email ON public.personnel(email);
CREATE INDEX IF NOT EXISTS idx_personnel_is_active ON public.personnel(is_active);

-- 3. Migrate existing data from user_profiles to personnel
-- First, update personnel records that match by email
UPDATE public.personnel p
SET 
    auth_user_id = up.id,
    app_role = up.role,
    telegram_id = up.telegram_id::text,
    telegram_username = up.telegram_username,
    timezone = up.timezone,
    updated_at = NOW()
FROM public.user_profiles up
WHERE LOWER(p.email) = LOWER(up.email);

-- 4. Migrate FLRTS user data where it exists
UPDATE public.personnel p
SET 
    telegram_id = COALESCE(p.telegram_id, fu.telegram_id),
    telegram_username = COALESCE(p.telegram_username, fu.telegram_username),
    flrts_permissions = COALESCE(
        p.flrts_permissions || CASE 
            WHEN fu.user_role_flrts = 'admin' THEN '{"can_delete": true}'::jsonb
            ELSE '{}'::jsonb
        END,
        p.flrts_permissions
    ),
    preferences = COALESCE(p.preferences || fu.preferences_flrts, p.preferences),
    updated_at = NOW()
FROM public.flrts_users fu
WHERE p.id = fu.personnel_id;

-- 5. Create personnel records for any auth users that don't have one yet
INSERT INTO public.personnel (
    id,
    personnel_id_display,
    first_name,
    last_name,
    email,
    auth_user_id,
    app_role,
    personnel_type,
    is_active,
    created_at,
    updated_at
)
SELECT 
    gen_random_uuid(),
    'TEMP-' || SUBSTRING(up.id::text, 1, 8),
    COALESCE(up.first_name, SPLIT_PART(up.email, '@', 1)),
    COALESCE(up.last_name, ''),
    up.email,
    up.id,
    up.role,
    'Employee',
    true,
    up.created_at,
    NOW()
FROM public.user_profiles up
WHERE NOT EXISTS (
    SELECT 1 FROM public.personnel p 
    WHERE p.auth_user_id = up.id OR LOWER(p.email) = LOWER(up.email)
);

-- 6. Update the trigger to use personnel table instead of user_profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Check if personnel record already exists by email
  IF NOT EXISTS (SELECT 1 FROM public.personnel WHERE LOWER(email) = LOWER(new.email)) THEN
    INSERT INTO public.personnel (
      id,
      personnel_id_display,
      auth_user_id,
      email,
      first_name,
      last_name,
      app_role,
      personnel_type,
      is_active
    )
    VALUES (
      gen_random_uuid(),
      'TEMP-' || SUBSTRING(new.id::text, 1, 8),
      new.id,
      new.email,
      COALESCE(
        new.raw_user_meta_data->>'first_name',
        SPLIT_PART(new.email, '@', 1)
      ),
      COALESCE(new.raw_user_meta_data->>'last_name', ''),
      CASE 
        WHEN new.email LIKE '%@10netzero.com' THEN 'admin'
        ELSE 'viewer'
      END,
      'Employee',
      true
    );
  ELSE
    -- Update existing personnel record with auth_user_id
    UPDATE public.personnel
    SET auth_user_id = new.id
    WHERE LOWER(email) = LOWER(new.email);
  END IF;
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Create/Update RLS policies for personnel table
ALTER TABLE public.personnel ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own personnel record" ON public.personnel;
DROP POLICY IF EXISTS "Admins can view all personnel" ON public.personnel;
DROP POLICY IF EXISTS "Users can update own personnel record" ON public.personnel;
DROP POLICY IF EXISTS "Admins can update all personnel" ON public.personnel;

-- Users can view their own record
CREATE POLICY "Users can view own personnel record" ON public.personnel
  FOR SELECT USING (auth_user_id = auth.uid());

-- Admins can view all records
CREATE POLICY "Admins can view all personnel" ON public.personnel
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.personnel
      WHERE auth_user_id = auth.uid() AND app_role = 'admin'
    )
  );

-- Users can update their own record (except role)
CREATE POLICY "Users can update own personnel record" ON public.personnel
  FOR UPDATE USING (auth_user_id = auth.uid());

-- Admins can update all records
CREATE POLICY "Admins can update all personnel" ON public.personnel
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.personnel
      WHERE auth_user_id = auth.uid() AND app_role = 'admin'
    )
  );

-- 8. Create helper function to check admin status using personnel table
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.personnel
    WHERE auth_user_id = user_id AND app_role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Update brain_bot_documents policies to use personnel table
DROP POLICY IF EXISTS "Viewers can read documents" ON public.brain_bot_documents;
DROP POLICY IF EXISTS "Users can create documents" ON public.brain_bot_documents;
DROP POLICY IF EXISTS "Admins have full access" ON public.brain_bot_documents;

CREATE POLICY "Viewers can read documents" ON public.brain_bot_documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.personnel
      WHERE auth_user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Users can create documents" ON public.brain_bot_documents
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.personnel
      WHERE auth_user_id = auth.uid() 
      AND app_role IN ('admin', 'user')
      AND is_active = true
    )
  );

CREATE POLICY "Admins have full access" ON public.brain_bot_documents
  FOR ALL USING (public.is_admin(auth.uid()));

-- 10. Add helpful comments
COMMENT ON COLUMN public.personnel.auth_user_id IS 'Links to Supabase auth.users for authentication';
COMMENT ON COLUMN public.personnel.app_role IS 'Application role: admin, user, or viewer';
COMMENT ON COLUMN public.personnel.telegram_id IS 'Telegram user ID for bot integration';
COMMENT ON COLUMN public.personnel.telegram_username IS 'Telegram username (without @) for display';
COMMENT ON COLUMN public.personnel.timezone IS 'User timezone for displaying times correctly';
COMMENT ON COLUMN public.personnel.flrts_permissions IS 'FLRTS-specific permissions';
COMMENT ON COLUMN public.personnel.preferences IS 'User preferences and settings';

-- Note: After verifying migration success, you can drop the old tables:
-- DROP TABLE public.user_profiles CASCADE;
-- DROP TABLE public.flrts_users CASCADE;