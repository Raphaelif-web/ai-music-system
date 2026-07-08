-- Replace public SECURITY DEFINER RPC with play_history trigger

CREATE OR REPLACE FUNCTION private.increment_play_count_on_history()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM private.increment_play_count(NEW.track_id);
  RETURN NEW;
END;
$$;

CREATE TRIGGER play_history_increment_count
  AFTER INSERT ON public.play_history
  FOR EACH ROW
  EXECUTE FUNCTION private.increment_play_count_on_history();

DROP FUNCTION IF EXISTS public.increment_play_count(UUID);
