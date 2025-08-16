-- Insert popular competitive programming platforms
INSERT INTO public.platforms (name, base_url, color) VALUES
  ('LeetCode', 'https://leetcode.com', '#FFA116'),
  ('Codeforces', 'https://codeforces.com', '#1F8ACB'),
  ('AtCoder', 'https://atcoder.jp', '#000000'),
  ('CodeChef', 'https://codechef.com', '#5B4638'),
  ('HackerRank', 'https://hackerrank.com', '#00EA64'),
  ('GeeksforGeeks', 'https://geeksforgeeks.org', '#0F9D58'),
  ('TopCoder', 'https://topcoder.com', '#29A8DF'),
  ('HackerEarth', 'https://hackerearth.com', '#323754')
ON CONFLICT (name) DO NOTHING;
