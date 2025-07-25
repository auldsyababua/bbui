-- Update brain_bot_documents policies to use the no-RLS admin check function
-- This prevents any potential recursion issues

-- Drop existing policies
DROP POLICY IF EXISTS "Viewers can read documents" ON public.brain_bot_documents;
DROP POLICY IF EXISTS "Users can create documents" ON public.brain_bot_documents;
DROP POLICY IF EXISTS "Admins have full access" ON public.brain_bot_documents;

-- Recreate policies using the is_admin_no_rls function

-- All authenticated users can read documents
CREATE POLICY "Viewers can read documents" ON public.brain_bot_documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.personnel
      WHERE auth_user_id = auth.uid()
    )
  );

-- Users and admins can create documents
CREATE POLICY "Users can create documents" ON public.brain_bot_documents
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.personnel
      WHERE auth_user_id = auth.uid() 
      AND app_role IN ('admin', 'user')
    )
  );

-- Admins have full access to all documents
CREATE POLICY "Admins have full access" ON public.brain_bot_documents
  FOR ALL USING (
    public.is_admin_no_rls(auth.uid())
  );