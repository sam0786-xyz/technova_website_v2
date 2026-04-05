-- Add accommodation tracking columns to hackathon_teams
ALTER TABLE hackathon_teams ADD COLUMN IF NOT EXISTS sex_ratio TEXT;
ALTER TABLE hackathon_teams ADD COLUMN IF NOT EXISTS arrival_date TEXT;
ALTER TABLE hackathon_teams ADD COLUMN IF NOT EXISTS departure_date TEXT;
ALTER TABLE hackathon_teams ADD COLUMN IF NOT EXISTS accommodation_boys INTEGER DEFAULT 0;
ALTER TABLE hackathon_teams ADD COLUMN IF NOT EXISTS accommodation_girls INTEGER DEFAULT 0;
