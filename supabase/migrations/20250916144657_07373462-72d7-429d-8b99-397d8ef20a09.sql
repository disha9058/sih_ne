-- Add missing columns to existing users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS health_center_id UUID,
ADD COLUMN IF NOT EXISTS district TEXT,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Create health_centers table
CREATE TABLE IF NOT EXISTS public.health_centers (
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
CREATE TABLE IF NOT EXISTS public.visits (
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
CREATE TABLE IF NOT EXISTS public.lab_reports (
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

-- Enable Row Level Security on new tables
ALTER TABLE public.health_centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lab_reports ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "All authenticated users can view health centers" 
  ON public.health_centers FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "ASHA workers can view their visits" 
  ON public.visits FOR SELECT 
  USING (
    asha_worker_id IN (
      SELECT id FROM public.users 
      WHERE role = 'asha'
    )
  );

CREATE POLICY "ASHA workers can create visits" 
  ON public.visits FOR INSERT 
  WITH CHECK (
    asha_worker_id IN (
      SELECT id FROM public.users 
      WHERE role = 'asha'
    )
  );

CREATE POLICY "DHO users can view lab reports" 
  ON public.lab_reports FOR SELECT 
  USING (
    tested_by_id IN (
      SELECT id FROM public.users 
      WHERE role = 'dho'
    )
  );

CREATE POLICY "DHO users can create lab reports" 
  ON public.lab_reports FOR INSERT 
  WITH CHECK (
    tested_by_id IN (
      SELECT id FROM public.users 
      WHERE role = 'dho'
    )
  );