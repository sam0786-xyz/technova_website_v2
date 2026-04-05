-- Add mentor_name column to hackathon_teams
ALTER TABLE hackathon_teams ADD COLUMN IF NOT EXISTS mentor_name TEXT;

-- Create team_updates tracking table
CREATE TABLE IF NOT EXISTS hackathon_team_updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID REFERENCES hackathon_teams(id) ON DELETE CASCADE,
    update_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
