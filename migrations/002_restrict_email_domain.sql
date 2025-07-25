-- Restrict signups to @10netzero.com email addresses only
-- This creates a database-level constraint to ensure security

-- Create a function to check email domain
CREATE OR REPLACE FUNCTION public.check_email_domain()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if email ends with @10netzero.com
  IF NOT LOWER(NEW.email) LIKE '%@10netzero.com' THEN
    RAISE EXCEPTION 'Only @10netzero.com email addresses are allowed to sign up';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS check_email_domain_on_signup ON auth.users;

-- Create trigger to check email domain on user creation
CREATE TRIGGER check_email_domain_on_signup
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.check_email_domain();

-- Also update the user_profiles table to have the same constraint
ALTER TABLE public.user_profiles
DROP CONSTRAINT IF EXISTS user_profiles_email_check;

ALTER TABLE public.user_profiles
ADD CONSTRAINT user_profiles_email_check 
CHECK (LOWER(email) LIKE '%@10netzero.com');

-- Add a helpful comment
COMMENT ON CONSTRAINT user_profiles_email_check ON public.user_profiles IS 'Restricts email addresses to @10netzero.com domain only';