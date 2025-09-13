-- Fix infinite recursion in personnel RLS policies
-- The issue is that is_admin() function queries personnel table,
-- but personnel policies use is_admin(), creating recursion

-- Drop existing personnel policies
DROP POLICY IF EXISTS "Users can view own personnel record" ON public.personnel;
DROP POLICY IF EXISTS "Admins can view all personnel" ON public.personnel;
DROP POLICY IF EXISTS "Users can update own personnel record" ON public.personnel;
DROP POLICY IF EXISTS "Admins can update all personnel" ON public.personnel;

-- Create a new function that checks admin status without RLS
-- This uses SECURITY DEFINER to bypass RLS checks
CREATE OR REPLACE FUNCTION public.is_admin_no_rls(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  is_admin_user BOOLEAN;
BEGIN
  -- Directly query the table without RLS
  SELECT app_role = 'admin' INTO is_admin_user
  FROM public.personnel
  WHERE auth_user_id = user_id
  LIMIT 1;
  
  RETURN COALESCE(is_admin_user, FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.is_admin_no_rls(UUID) TO authenticated;

-- Recreate personnel policies using direct checks instead of is_admin()
-- This avoids the recursion issue

-- Users can view their own record
CREATE POLICY "Users can view own personnel record" ON public.personnel
  FOR SELECT USING (auth_user_id = auth.uid());

-- Admins can view all records - using the no-RLS function
CREATE POLICY "Admins can view all personnel" ON public.personnel
  FOR SELECT USING (
    public.is_admin_no_rls(auth.uid())
  );

-- Users can update their own record (excluding certain fields)
CREATE POLICY "Users can update own personnel record" ON public.personnel
  FOR UPDATE USING (auth_user_id = auth.uid());

-- Admins can update all records
CREATE POLICY "Admins can update all personnel" ON public.personnel
  FOR UPDATE USING (
    public.is_admin_no_rls(auth.uid())
  );

-- Enable RLS
ALTER TABLE public.personnel ENABLE ROW LEVEL SECURITY;