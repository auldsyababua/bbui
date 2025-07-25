-- Fix user profile creation for Google OAuth users
-- This ensures profiles are created with proper data from OAuth providers

-- First, create any missing profiles for existing auth users
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
WHERE up.id IS NULL;

-- Update the trigger to handle OAuth metadata
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

-- Also add columns for Telegram data if they don't exist
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS telegram_id TEXT,
ADD COLUMN IF NOT EXISTS telegram_username TEXT;

-- Add a note about the admin user warning
COMMENT ON TABLE public.user_profiles IS 'User profiles with role-based access. Note: The "Service role key not configured" warning in the UI can be ignored - users are created automatically via Supabase Auth.';