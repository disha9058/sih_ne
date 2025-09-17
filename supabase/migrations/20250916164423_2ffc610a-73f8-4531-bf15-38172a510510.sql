-- Update the handle_new_user function to include the new fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.users (auth_user_id, email, name, role, phone, district, asha_id, employee_id)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'community'),
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'district',
    NEW.raw_user_meta_data->>'ashaId',
    NEW.raw_user_meta_data->>'employeeId'
  );
  RETURN NEW;
END;
$function$;