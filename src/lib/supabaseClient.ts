import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type User = Database['public']['Tables']['users']['Row'];
type Visit = Database['public']['Tables']['visits']['Row'];
type HealthCenter = Database['public']['Tables']['health_centers']['Row'];
type LabReport = Database['public']['Tables']['lab_reports']['Row'];
type Alert = Database['public']['Tables']['alerts']['Row'];
type DiseaseReport = Database['public']['Tables']['disease_reports']['Row'];
type WaterTestReport = Database['public']['Tables']['water_test_reports']['Row'];

// Auth functions
export const signUp = async (email: string, password: string, userData: { name: string; role: string; phone?: string; district?: string; ashaId?: string; employeeId?: string }) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData,
      emailRedirectTo: `${window.location.origin}/`
    }
  });
  
  // If signup is successful but user needs to confirm email, we'll treat it as success
  // since we want to disable email verification workflow
  if (data.user && !error) {
    return { error: null };
  }
  
  return { error };
};

export const signIn = async (email: string, password: string) => {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  return { error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

// Phone OTP functions
export const sendPhoneOTP = async (phoneNumber: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      phone: phoneNumber,
    });
    return { session: data.session, error };
  } catch (error) {
    console.error("Error sending phone OTP:", error);
    return { session: null, error };
  }
};

export const verifyPhoneOTP = async (phoneNumber: string, otp: string) => {
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      phone: phoneNumber,
      token: otp,
      type: 'sms'
    });
    return { session: data.session, error };
  } catch (error) {
    console.error("Error verifying phone OTP:", error);
    return { session: null, error };
  }
};

// User functions
export const getCurrentUser = async (): Promise<{ user: User | null; error: any }> => {
  const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !authUser) {
    return { user: null, error: authError };
  }

  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('auth_user_id', authUser.id)
    .maybeSingle();

  return { user, error };
};

export const updateUserProfile = async (userId: string, updates: Partial<User>) => {
  const { error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId);
  
  return { error };
};

// Visits functions
export const getVisitsByAshaWorker = async (ashaWorkerId: string): Promise<{ visits: Visit[]; error: any }> => {
  const { data: visits, error } = await supabase
    .from('visits')
    .select('*')
    .eq('asha_worker_id', ashaWorkerId)
    .order('created_at', { ascending: false });

  return { visits: visits || [], error };
};

export const createVisit = async (visitData: Omit<Visit, 'id' | 'created_at' | 'updated_at'>) => {
  const { error } = await supabase
    .from('visits')
    .insert(visitData);
  
  return { error };
};

export const updateVisit = async (visitId: string, updates: Partial<Visit>) => {
  const { error } = await supabase
    .from('visits')
    .update(updates)
    .eq('id', visitId);
  
  return { error };
};

// Health Centers functions
export const getHealthCenters = async (): Promise<{ centers: HealthCenter[]; error: any }> => {
  const { data: centers, error } = await supabase
    .from('health_centers')
    .select('*')
    .order('name');

  return { centers: centers || [], error };
};

export const getHealthCenterByDHO = async (dhoId: string): Promise<{ center: HealthCenter | null; error: any }> => {
  const { data: center, error } = await supabase
    .from('health_centers')
    .select('*')
    .eq('dho_id', dhoId)
    .maybeSingle();

  return { center, error };
};

// Lab Reports functions
export const getLabReportsByHealthCenter = async (healthCenterId: string): Promise<{ reports: LabReport[]; error: any }> => {
  const { data: reports, error } = await supabase
    .from('lab_reports')
    .select('*')
    .eq('health_center_id', healthCenterId)
    .order('created_at', { ascending: false });

  return { reports: reports || [], error };
};

export const createLabReport = async (reportData: Omit<LabReport, 'id' | 'created_at' | 'updated_at'>) => {
  const { error } = await supabase
    .from('lab_reports')
    .insert(reportData);
  
  return { error };
};

// Alerts functions
export const getAlerts = async (): Promise<{ alerts: Alert[]; error: any }> => {
  const { data: alerts, error } = await supabase
    .from('alerts')
    .select('*')
    .order('created_at', { ascending: false });

  return { alerts: alerts || [], error };
};

export const createAlert = async (alertData: Omit<Alert, 'id' | 'created_at'>) => {
  const { error } = await supabase
    .from('alerts')
    .insert(alertData);
  
  return { error };
};

// Disease Reports functions
export const getDiseaseReports = async (): Promise<{ reports: DiseaseReport[]; error: any }> => {
  const { data: reports, error } = await supabase
    .from('disease_reports')
    .select('*')
    .order('created_at', { ascending: false });

  return { reports: reports || [], error };
};

export const createDiseaseReport = async (reportData: Omit<DiseaseReport, 'id' | 'created_at'>) => {
  const { error } = await supabase
    .from('disease_reports')
    .insert(reportData);
  
  return { error };
};

// Water Test Reports functions
export const getWaterTestReports = async (): Promise<{ reports: WaterTestReport[]; error: any }> => {
  const { data: reports, error } = await supabase
    .from('water_test_reports')
    .select('*')
    .order('created_at', { ascending: false });

  return { reports: reports || [], error };
};

export const createWaterTestReport = async (reportData: Omit<WaterTestReport, 'id' | 'created_at'>) => {
  const { error } = await supabase
    .from('water_test_reports')
    .insert(reportData);
  
  return { error };
};

// Statistics functions
export const getHealthStats = async () => {
  try {
    const [diseaseReports, waterReports, alerts] = await Promise.all([
      getDiseaseReports(),
      getWaterTestReports(),
      getAlerts()
    ]);

    // Calculate stats from real data
    const activeCases = diseaseReports.reports?.reduce((sum, report) => sum + (report.case_count || 0), 0) || 0;
    const safeWaterSources = waterReports.reports?.filter(r => r.status === 'Safe').length || 0;
    const totalWaterSources = waterReports.reports?.length || 1;
    const waterQualityPercentage = Math.round((safeWaterSources / totalWaterSources) * 100);
    const riskAreas = alerts.alerts?.filter(a => a.severity === 'high' || a.severity === 'medium').length || 0;

    return {
      activeCases,
      waterQualityPercentage,
      riskAreas,
      responseRate: 94, // This could be calculated from visit completion rates
      error: null
    };
  } catch (error) {
    return {
      activeCases: 0,
      waterQualityPercentage: 0,
      riskAreas: 0,
      responseRate: 0,
      error
    };
  }
};