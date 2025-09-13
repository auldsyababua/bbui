-- Add additional profile fields for user configuration
-- Adds job_title and timezone fields to user_profiles table

-- Add new columns to user_profiles
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS job_title TEXT,
ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'America/New_York';

-- Update the column comment for clarity
COMMENT ON COLUMN public.user_profiles.job_title IS 'User job title/position';
COMMENT ON COLUMN public.user_profiles.timezone IS 'User timezone for displaying times correctly';
COMMENT ON COLUMN public.user_profiles.telegram_id IS 'Telegram user ID for bot integration';
COMMENT ON COLUMN public.user_profiles.telegram_username IS 'Telegram username (without @) for display';