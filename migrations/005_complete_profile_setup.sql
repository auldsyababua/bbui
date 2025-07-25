-- Complete Profile Setup Migration
-- This migration ensures all profile fields and OAuth support are properly configured

-- 1. Add missing columns to user_profiles if they don't exist
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS job_title TEXT,
ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'America/New_York',
ADD COLUMN IF NOT EXISTS telegram_id TEXT,
ADD COLUMN IF NOT EXISTS telegram_username TEXT;

-- 2. Create/update the trigger to handle OAuth users properly
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, role)
  VALUES (
    new.id, 
    new.email,
    COALESCE(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      split_part(new.email, '@', 1)
    ),
    CASE 
      WHEN new.email LIKE '%@10netzero.com' THEN 'admin'
      ELSE 'viewer'
    END
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    updated_at = NOW();
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Create any missing profiles for existing users (like your Google login)
INSERT INTO public.user_profiles (id, email, full_name, role)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'full_name', au.raw_user_meta_data->>'name', split_part(au.email, '@', 1)) as full_name,
  CASE 
    WHEN au.email LIKE '%@10netzero.com' THEN 'admin'
    ELSE 'viewer'
  END as role
FROM auth.users au
LEFT JOIN public.user_profiles up ON au.id = up.id
WHERE up.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- 4. Add helpful comments
COMMENT ON COLUMN public.user_profiles.job_title IS 'User job title/position';
COMMENT ON COLUMN public.user_profiles.timezone IS 'User timezone for displaying times correctly';
COMMENT ON COLUMN public.user_profiles.telegram_id IS 'Telegram user ID for bot integration';
COMMENT ON COLUMN public.user_profiles.telegram_username IS 'Telegram username (without @) for display';