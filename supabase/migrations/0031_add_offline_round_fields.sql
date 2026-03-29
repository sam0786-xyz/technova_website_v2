-- Add new offline round fields
ALTER TABLE public.hackathon_teams
    ADD COLUMN IF NOT EXISTS student_coordinator TEXT,
    ADD COLUMN IF NOT EXISTS coordinator_phone TEXT,
    ADD COLUMN IF NOT EXISTS need_accommodation BOOLEAN DEFAULT false,
    ADD COLUMN IF NOT EXISTS remarks TEXT;
