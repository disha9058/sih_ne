-- Insert sample data for testing

-- Sample health centers
INSERT INTO public.health_centers (name, district, location, contact_phone) VALUES 
('Guwahati Primary Health Center', 'Kamrup Metropolitan', 'Guwahati, Assam', '+91-361-2345678'),
('Jorhat District Hospital', 'Jorhat', 'Jorhat, Assam', '+91-376-2234567'),
('Dibrugarh Medical College', 'Dibrugarh', 'Dibrugarh, Assam', '+91-373-2345678'),
('Silchar Medical College', 'Cachar', 'Silchar, Assam', '+91-3842-234567');

-- Sample users (will be created when actual users sign up through auth)
-- Note: These are just for reference, real users will be created via the auth trigger

-- Sample water test reports
INSERT INTO public.water_test_reports (location, parameter, result_value, status, date) VALUES 
('Guwahati Ward 12', 'E.coli', '0 CFU/100ml', 'safe', CURRENT_DATE),
('Jorhat Tea Estate', 'Coliform', '15 CFU/100ml', 'contaminated', CURRENT_DATE - INTERVAL '1 day'),
('Dibrugarh Village', 'pH Level', '7.2', 'safe', CURRENT_DATE - INTERVAL '2 days'),
('Silchar Market Area', 'Turbidity', '8 NTU', 'contaminated', CURRENT_DATE - INTERVAL '3 days'),
('Majuli Island', 'Arsenic', '0.08 mg/L', 'contaminated', CURRENT_DATE - INTERVAL '4 days');

-- Sample disease reports
INSERT INTO public.disease_reports (community_name, disease, case_count, date) VALUES 
('Majuli Village', 'Cholera', 12, CURRENT_DATE - INTERVAL '1 day'),
('Jorhat Town', 'Diarrhea', 8, CURRENT_DATE - INTERVAL '2 days'),
('Guwahati Slum', 'Typhoid', 5, CURRENT_DATE - INTERVAL '3 days'),
('Dibrugarh Rural', 'Hepatitis A', 3, CURRENT_DATE - INTERVAL '4 days'),
('Silchar Urban', 'Gastroenteritis', 15, CURRENT_DATE - INTERVAL '5 days');

-- Sample alerts
INSERT INTO public.alerts (message, severity, location) VALUES 
('High cholera risk detected in Majuli area', 'critical', 'Majuli Island, Jorhat'),
('Water contamination reported', 'high', 'Tea Estate, Jorhat'),
('Unusual diarrhea cases increase', 'medium', 'Urban Guwahati'),
('Water quality testing required', 'low', 'Dibrugarh District'),
('Preventive measures recommended', 'medium', 'Silchar Municipality');