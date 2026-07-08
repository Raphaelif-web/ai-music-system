-- Dev: auto-confirm emails on signup so login works immediately without SMTP

CREATE OR REPLACE FUNCTION public.auto_confirm_user_email()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = auth, public
AS $$
BEGIN
  UPDATE auth.users
  SET email_confirmed_at = COALESCE(email_confirmed_at, NOW())
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.auto_confirm_user_email() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.auto_confirm_user_email() FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.auto_confirm_user_email() TO postgres, service_role;

DROP TRIGGER IF EXISTS on_auth_user_auto_confirm ON auth.users;
CREATE TRIGGER on_auth_user_auto_confirm
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_confirm_user_email();

UPDATE auth.users
SET email_confirmed_at = COALESCE(email_confirmed_at, NOW())
WHERE email_confirmed_at IS NULL;
