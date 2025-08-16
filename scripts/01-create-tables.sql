-- Create users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username VARCHAR(50) UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create platforms table
CREATE TABLE IF NOT EXISTS public.platforms (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  base_url TEXT NOT NULL,
  icon_url TEXT,
  color VARCHAR(7), -- hex color code
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user platform connections
CREATE TABLE IF NOT EXISTS public.user_platforms (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  platform_id INTEGER REFERENCES public.platforms(id) ON DELETE CASCADE,
  platform_username VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  last_synced TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, platform_id)
);

-- Create submissions table
CREATE TABLE IF NOT EXISTS public.submissions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  platform_id INTEGER REFERENCES public.platforms(id) ON DELETE CASCADE,
  problem_title VARCHAR(255) NOT NULL,
  problem_url TEXT,
  difficulty VARCHAR(20), -- Easy, Medium, Hard
  category VARCHAR(50), -- Array, String, DP, etc.
  status VARCHAR(20) NOT NULL, -- Accepted, Wrong Answer, TLE, etc.
  language VARCHAR(30),
  submission_date TIMESTAMP WITH TIME ZONE NOT NULL,
  execution_time INTEGER, -- in milliseconds
  memory_used INTEGER, -- in KB
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contests table
CREATE TABLE IF NOT EXISTS public.contests (
  id SERIAL PRIMARY KEY,
  platform_id INTEGER REFERENCES public.platforms(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  contest_url TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  duration INTEGER NOT NULL, -- in minutes
  is_rated BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contest participations
CREATE TABLE IF NOT EXISTS public.contest_participations (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  contest_id INTEGER REFERENCES public.contests(id) ON DELETE CASCADE,
  rank INTEGER,
  score INTEGER,
  problems_solved INTEGER DEFAULT 0,
  rating_change INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, contest_id)
);

-- Create reminders table
CREATE TABLE IF NOT EXISTS public.contest_reminders (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  contest_id INTEGER REFERENCES public.contests(id) ON DELETE CASCADE,
  reminder_time TIMESTAMP WITH TIME ZONE NOT NULL,
  is_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, contest_id)
);

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contest_participations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contest_reminders ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own platforms" ON public.user_platforms
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own submissions" ON public.submissions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own contest participations" ON public.contest_participations
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own reminders" ON public.contest_reminders
  FOR ALL USING (auth.uid() = user_id);

-- Public read access for platforms and contests
CREATE POLICY "Anyone can view platforms" ON public.platforms
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view contests" ON public.contests
  FOR SELECT USING (true);
