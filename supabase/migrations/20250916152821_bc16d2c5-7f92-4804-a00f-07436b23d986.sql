-- Fix RLS security issues on existing tables
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disease_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.water_test_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies for existing tables
CREATE POLICY "All authenticated users can view alerts" 
  ON public.alerts FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "DHO and authority users can create alerts" 
  ON public.alerts FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE auth_user_id = auth.uid() AND role IN ('dho', 'authority')
    )
  );

CREATE POLICY "All authenticated users can view disease reports" 
  ON public.disease_reports FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "ASHA and DHO users can create disease reports" 
  ON public.disease_reports FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE auth_user_id = auth.uid() AND role IN ('asha', 'dho')
    )
  );

CREATE POLICY "All authenticated users can view water test reports" 
  ON public.water_test_reports FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "DHO users can create water test reports" 
  ON public.water_test_reports FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE auth_user_id = auth.uid() AND role = 'dho'
    )
  );

CREATE POLICY "Users can view their own profile" 
  ON public.users FOR SELECT 
  USING (auth_user_id = auth.uid());

CREATE POLICY "Users can update their own profile" 
  ON public.users FOR UPDATE 
  USING (auth_user_id = auth.uid());

CREATE POLICY "Authority users can view all users" 
  ON public.users FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE auth_user_id = auth.uid() AND role = 'authority'
    )
  );