-- Add problems table for centralized problem management
CREATE TABLE IF NOT EXISTS public.problems (
  id SERIAL PRIMARY KEY,
  platform_id INTEGER REFERENCES public.platforms(id) ON DELETE CASCADE,
  problem_id VARCHAR(50) NOT NULL, -- platform-specific problem ID
  title VARCHAR(255) NOT NULL,
  description TEXT,
  difficulty VARCHAR(20), -- Easy, Medium, Hard
  category VARCHAR(50), -- Array, String, DP, etc.
  tags TEXT[], -- array of tags
  problem_url TEXT,
  acceptance_rate DECIMAL(5,2), -- percentage
  total_submissions INTEGER DEFAULT 0,
  total_accepted INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(platform_id, problem_id)
);

-- Add user statistics table for real-time tracking
CREATE TABLE IF NOT EXISTS public.user_statistics (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE UNIQUE,
  total_problems_solved INTEGER DEFAULT 0,
  easy_solved INTEGER DEFAULT 0,
  medium_solved INTEGER DEFAULT 0,
  hard_solved INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  max_streak INTEGER DEFAULT 0,
  last_submission_date DATE,
  total_contest_participations INTEGER DEFAULT 0,
  average_contest_rank DECIMAL(10,2),
  highest_rating INTEGER DEFAULT 0,
  current_rating INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add sync status table for real-time platform updates
CREATE TABLE IF NOT EXISTS public.sync_status (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  platform_id INTEGER REFERENCES public.platforms(id) ON DELETE CASCADE,
  last_sync_time TIMESTAMP WITH TIME ZONE,
  sync_status VARCHAR(20) DEFAULT 'pending', -- pending, syncing, completed, failed
  error_message TEXT,
  submissions_synced INTEGER DEFAULT 0,
  contests_synced INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, platform_id)
);

-- Add user problem progress table
CREATE TABLE IF NOT EXISTS public.user_problem_progress (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  problem_id INTEGER REFERENCES public.problems(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'not_attempted', -- not_attempted, attempted, solved, reviewed
  attempts INTEGER DEFAULT 0,
  first_attempt_date TIMESTAMP WITH TIME ZONE,
  solved_date TIMESTAMP WITH TIME ZONE,
  best_submission_id INTEGER REFERENCES public.submissions(id),
  notes TEXT,
  time_spent INTEGER DEFAULT 0, -- in minutes
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, problem_id)
);

-- Add real-time activity feed
CREATE TABLE IF NOT EXISTS public.activity_feed (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  activity_type VARCHAR(50) NOT NULL, -- problem_solved, contest_participated, streak_updated
  title VARCHAR(255) NOT NULL,
  description TEXT,
  metadata JSONB, -- flexible data storage
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for new tables
ALTER TABLE public.problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sync_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_problem_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_feed ENABLE ROW LEVEL SECURITY;

-- Public read access for problems
CREATE POLICY "Anyone can view problems" ON public.problems
  FOR SELECT USING (true);

-- Users can only access their own statistics
CREATE POLICY "Users can view own statistics" ON public.user_statistics
  FOR ALL USING (auth.uid() = user_id);

-- Users can only access their own sync status
CREATE POLICY "Users can view own sync status" ON public.sync_status
  FOR ALL USING (auth.uid() = user_id);

-- Users can only access their own problem progress
CREATE POLICY "Users can view own problem progress" ON public.user_problem_progress
  FOR ALL USING (auth.uid() = user_id);

-- Users can view public activity feed and manage their own
CREATE POLICY "Users can view public activity" ON public.activity_feed
  FOR SELECT USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can manage own activity" ON public.activity_feed
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own activity" ON public.activity_feed
  FOR UPDATE USING (auth.uid() = user_id);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_submissions_user_date ON public.submissions(user_id, submission_date DESC);
CREATE INDEX IF NOT EXISTS idx_problems_platform_difficulty ON public.problems(platform_id, difficulty);
CREATE INDEX IF NOT EXISTS idx_user_progress_status ON public.user_problem_progress(user_id, status);
CREATE INDEX IF NOT EXISTS idx_activity_feed_user_date ON public.activity_feed(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sync_status_user_platform ON public.sync_status(user_id, platform_id);
