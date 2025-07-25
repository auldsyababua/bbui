-- Fix infinite recursion in user_profiles RLS policies
-- This migration fixes the circular reference issue in RLS policies

-- Drop the problematic policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can update profiles" ON public.user_profiles;

-- Create a security definer function to check admin status
-- This avoids RLS recursion by running with elevated privileges
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the admin policies using the function
CREATE POLICY "Admins can view all profiles" ON public.user_profiles
  FOR SELECT USING (
    auth.uid() = id OR public.is_admin(auth.uid())
  );

CREATE POLICY "Admins can update profiles" ON public.user_profiles
  FOR UPDATE USING (
    public.is_admin(auth.uid())
  );

-- Also fix the brain_bot_documents policies to use the function
DROP POLICY IF EXISTS "Viewers can read documents" ON public.brain_bot_documents;
DROP POLICY IF EXISTS "Users can create documents" ON public.brain_bot_documents;
DROP POLICY IF EXISTS "Admins have full access" ON public.brain_bot_documents;

-- Recreate with the helper function
CREATE POLICY "Viewers can read documents" ON public.brain_bot_documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can create documents" ON public.brain_bot_documents
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role IN ('admin', 'user')
    )
  );

CREATE POLICY "Admins have full access" ON public.brain_bot_documents
  FOR ALL USING (
    public.is_admin(auth.uid())
  );

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO authenticated;