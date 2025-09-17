-- Create users table for different roles
CREATE TABLE public.users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('community', 'asha', 'dho', 'authority')),
  phone TEXT,
  health_center_id UUID,
  district TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create health_centers table
CREATE TABLE public.health_centers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  district TEXT NOT NULL,
  location TEXT,
  contact_phone TEXT,
  dho_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create visits table for ASHA worker visits
CREATE TABLE public.visits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  asha_worker_id UUID NOT NULL,
  patient_name TEXT NOT NULL,
  village TEXT NOT NULL,
  visit_type TEXT NOT NULL CHECK (visit_type IN ('routine', 'follow_up', 'emergency', 'water_testing')),
  symptoms TEXT,
  diagnosis TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  notes TEXT,
  visit_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create lab_reports table for DHO lab reports
CREATE TABLE public.lab_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sample_id TEXT NOT NULL UNIQUE,
  location TEXT NOT NULL,
  report_type TEXT NOT NULL CHECK (report_type IN ('water_quality', 'disease_diagnosis', 'pathogen_test')),
  parameters JSONB,
  results JSONB,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'contaminated', 'safe')),
  tested_by_id UUID,
  health_center_id UUID,
  test_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add foreign key constraints
ALTER TABLE public.users ADD CONSTRAINT fk_users_health_center 
  FOREIGN KEY (health_center_id) REFERENCES public.health_centers(id);

ALTER TABLE public.health_centers ADD CONSTRAINT fk_health_centers_dho 
  FOREIGN KEY (dho_id) REFERENCES public.users(id);

ALTER TABLE public.visits ADD CONSTRAINT fk_visits_asha_worker 
  FOREIGN KEY (asha_worker_id) REFERENCES public.users(id);

ALTER TABLE public.lab_reports ADD CONSTRAINT fk_lab_reports_tested_by 
  FOREIGN KEY (tested_by_id) REFERENCES public.users(id);

ALTER TABLE public.lab_reports ADD CONSTRAINT fk_lab_reports_health_center 
  FOREIGN KEY (health_center_id) REFERENCES public.health_centers(id);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lab_reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile" 
  ON public.users FOR SELECT 
  USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can update their own profile" 
  ON public.users FOR UPDATE 
  USING (auth.uid() = auth_user_id);

CREATE POLICY "Authority users can view all users" 
  ON public.users FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE auth_user_id = auth.uid() AND role = 'authority'
    )
  );

-- RLS Policies for health_centers table
CREATE POLICY "All authenticated users can view health centers" 
  ON public.health_centers FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "DHO users can update their health center" 
  ON public.health_centers FOR UPDATE 
  USING (dho_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));

-- RLS Policies for visits table
CREATE POLICY "ASHA workers can view their visits" 
  ON public.visits FOR SELECT 
  USING (
    asha_worker_id IN (
      SELECT id FROM public.users 
      WHERE auth_user_id = auth.uid() AND role = 'asha'
    )
  );

CREATE POLICY "ASHA workers can create visits" 
  ON public.visits FOR INSERT 
  WITH CHECK (
    asha_worker_id IN (
      SELECT id FROM public.users 
      WHERE auth_user_id = auth.uid() AND role = 'asha'
    )
  );

CREATE POLICY "ASHA workers can update their visits" 
  ON public.visits FOR UPDATE 
  USING (
    asha_worker_id IN (
      SELECT id FROM public.users 
      WHERE auth_user_id = auth.uid() AND role = 'asha'
    )
  );

-- RLS Policies for lab_reports table
CREATE POLICY "DHO users can view lab reports from their health center" 
  ON public.lab_reports FOR SELECT 
  USING (
    health_center_id IN (
      SELECT health_center_id FROM public.users 
      WHERE auth_user_id = auth.uid() AND role = 'dho'
    )
  );

CREATE POLICY "DHO users can create lab reports" 
  ON public.lab_reports FOR INSERT 
  WITH CHECK (
    tested_by_id IN (
      SELECT id FROM public.users 
      WHERE auth_user_id = auth.uid() AND role = 'dho'
    )
  );

CREATE POLICY "DHO users can update lab reports" 
  ON public.lab_reports FOR UPDATE 
  USING (
    tested_by_id IN (
      SELECT id FROM public.users 
      WHERE auth_user_id = auth.uid() AND role = 'dho'
    )
  );

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_health_centers_updated_at
  BEFORE UPDATE ON public.health_centers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_visits_updated_at
  BEFORE UPDATE ON public.visits
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lab_reports_updated_at
  BEFORE UPDATE ON public.lab_reports
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to handle user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (auth_user_id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'community')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on auth signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();