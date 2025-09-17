-- Fix infinite recursion in users table policies
-- Drop the problematic policy that causes infinite recursion
DROP POLICY IF EXISTS "Authority users can view all users" ON public.users;

-- Create a proper policy for authority users that doesn't cause recursion
-- Authority users can view all users based on their auth metadata role
CREATE POLICY "Authority users can view all users" 
ON public.users 
FOR SELECT 
USING (
  (auth.jwt() ->> 'role')::text = 'authority' 
  OR 
  (auth.jwt() -> 'user_metadata' ->> 'role')::text = 'authority'
  OR
  auth_user_id = auth.uid()
);