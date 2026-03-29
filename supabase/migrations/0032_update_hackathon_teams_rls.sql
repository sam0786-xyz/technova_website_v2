-- Drop the old restrictive RLS policy that only allowed public to see 'shortlisted' teams
DROP POLICY IF EXISTS "Public can see shortlisted teams" ON public.hackathon_teams;

-- Create a new policy that allows public to see all teams (safe fields only, enforced at API layer)
CREATE POLICY "Public can read all teams" ON public.hackathon_teams
    FOR SELECT USING (true);
