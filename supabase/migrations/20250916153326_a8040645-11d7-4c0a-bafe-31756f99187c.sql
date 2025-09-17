-- Insert sample data with correct severity values

-- Sample alerts with valid severity values (using lowercase as that seems to be the constraint)
INSERT INTO public.alerts (message, severity, location) VALUES 
('High cholera risk detected in Majuli area', 'high', 'Majuli Island, Jorhat'),
('Water contamination reported', 'medium', 'Tea Estate, Jorhat'),
('Unusual diarrhea cases increase', 'medium', 'Urban Guwahati'),
('Water quality testing required', 'low', 'Dibrugarh District'),
('Preventive measures recommended', 'low', 'Silchar Municipality');