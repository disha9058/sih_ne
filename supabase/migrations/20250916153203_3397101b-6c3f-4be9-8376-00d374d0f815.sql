-- Insert sample data with correct status values

-- Sample water test reports with valid status values
INSERT INTO public.water_test_reports (location, parameter, result_value, status, date) VALUES 
('Guwahati Ward 12', 'E.coli', '0 CFU/100ml', 'Normal', CURRENT_DATE),
('Jorhat Tea Estate', 'Coliform', '15 CFU/100ml', 'Abnormal', CURRENT_DATE - INTERVAL '1 day'),
('Dibrugarh Village', 'pH Level', '7.2', 'Normal', CURRENT_DATE - INTERVAL '2 days'),
('Silchar Market Area', 'Turbidity', '8 NTU', 'Abnormal', CURRENT_DATE - INTERVAL '3 days'),
('Majuli Island', 'Arsenic', '0.08 mg/L', 'Abnormal', CURRENT_DATE - INTERVAL '4 days');

-- Sample disease reports
INSERT INTO public.disease_reports (community_name, disease, case_count, date) VALUES 
('Majuli Village', 'Cholera', 12, CURRENT_DATE - INTERVAL '1 day'),
('Jorhat Town', 'Diarrhea', 8, CURRENT_DATE - INTERVAL '2 days'),
('Guwahati Slum', 'Typhoid', 5, CURRENT_DATE - INTERVAL '3 days'),
('Dibrugarh Rural', 'Hepatitis A', 3, CURRENT_DATE - INTERVAL '4 days'),
('Silchar Urban', 'Gastroenteritis', 15, CURRENT_DATE - INTERVAL '5 days');

-- Sample alerts
INSERT INTO public.alerts (message, severity, location) VALUES 
('High cholera risk detected in Majuli area', 'High', 'Majuli Island, Jorhat'),
('Water contamination reported', 'Medium', 'Tea Estate, Jorhat'),
('Unusual diarrhea cases increase', 'Medium', 'Urban Guwahati'),
('Water quality testing required', 'Low', 'Dibrugarh District'),
('Preventive measures recommended', 'Low', 'Silchar Municipality');