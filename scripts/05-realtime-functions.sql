-- Create function to update user statistics automatically
CREATE OR REPLACE FUNCTION update_user_statistics()
RETURNS TRIGGER AS $$
BEGIN
  -- Update statistics when a new submission is added
  IF TG_OP = 'INSERT' AND NEW.status = 'Accepted' THEN
    INSERT INTO public.user_statistics (user_id, total_problems_solved, easy_solved, medium_solved, hard_solved, last_submission_date)
    VALUES (NEW.user_id, 1, 
            CASE WHEN NEW.difficulty = 'Easy' THEN 1 ELSE 0 END,
            CASE WHEN NEW.difficulty = 'Medium' THEN 1 ELSE 0 END,
            CASE WHEN NEW.difficulty = 'Hard' THEN 1 ELSE 0 END,
            NEW.submission_date::DATE)
    ON CONFLICT (user_id) DO UPDATE SET
      total_problems_solved = user_statistics.total_problems_solved + 1,
      easy_solved = user_statistics.easy_solved + CASE WHEN NEW.difficulty = 'Easy' THEN 1 ELSE 0 END,
      medium_solved = user_statistics.medium_solved + CASE WHEN NEW.difficulty = 'Medium' THEN 1 ELSE 0 END,
      hard_solved = user_statistics.hard_solved + CASE WHEN NEW.difficulty = 'Hard' THEN 1 ELSE 0 END,
      last_submission_date = NEW.submission_date::DATE,
      updated_at = NOW();
      
    -- Update streak
    PERFORM update_user_streak(NEW.user_id);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to calculate and update user streak
CREATE OR REPLACE FUNCTION update_user_streak(user_uuid UUID)
RETURNS void AS $$
DECLARE
  current_streak_count INTEGER := 0;
  max_streak_count INTEGER := 0;
  last_date DATE;
  check_date DATE;
BEGIN
  -- Get the most recent submission date
  SELECT MAX(submission_date::DATE) INTO last_date
  FROM public.submissions 
  WHERE user_id = user_uuid AND status = 'Accepted';
  
  IF last_date IS NULL THEN
    RETURN;
  END IF;
  
  -- Calculate current streak
  check_date := last_date;
  WHILE check_date IS NOT NULL LOOP
    IF EXISTS (
      SELECT 1 FROM public.submissions 
      WHERE user_id = user_uuid 
      AND status = 'Accepted' 
      AND submission_date::DATE = check_date
    ) THEN
      current_streak_count := current_streak_count + 1;
      check_date := check_date - INTERVAL '1 day';
    ELSE
      EXIT;
    END IF;
  END LOOP;
  
  -- Get max streak from current statistics
  SELECT COALESCE(max_streak, 0) INTO max_streak_count
  FROM public.user_statistics 
  WHERE user_id = user_uuid;
  
  -- Update statistics
  UPDATE public.user_statistics 
  SET 
    current_streak = current_streak_count,
    max_streak = GREATEST(max_streak_count, current_streak_count),
    updated_at = NOW()
  WHERE user_id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic statistics updates
DROP TRIGGER IF EXISTS trigger_update_user_statistics ON public.submissions;
CREATE TRIGGER trigger_update_user_statistics
  AFTER INSERT ON public.submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_user_statistics();

-- Create function to sync platform data
CREATE OR REPLACE FUNCTION start_platform_sync(user_uuid UUID, platform_name TEXT)
RETURNS void AS $$
DECLARE
  platform_record RECORD;
BEGIN
  -- Get platform ID
  SELECT id INTO platform_record FROM public.platforms WHERE name = platform_name;
  
  IF platform_record.id IS NULL THEN
    RAISE EXCEPTION 'Platform % not found', platform_name;
  END IF;
  
  -- Update sync status
  INSERT INTO public.sync_status (user_id, platform_id, sync_status, updated_at)
  VALUES (user_uuid, platform_record.id, 'syncing', NOW())
  ON CONFLICT (user_id, platform_id) DO UPDATE SET
    sync_status = 'syncing',
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
