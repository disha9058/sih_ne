-- Fix infinite recursion by creating a security definer function
-- Drop the problematic policy
DROP POLICY IF EXISTS "Authority users can view all users" ON public.users;

-- Create a security definer function to safely check user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.users WHERE auth_user_id = auth.uid() LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

-- Create a proper policy using the security definer function
CREATE POLICY "Authority users can view all users" 
ON public.users 
FOR SELECT 
USING (
  public.get_current_user_role() = 'authority' 
  OR 
  auth_user_id = auth.uid()
);