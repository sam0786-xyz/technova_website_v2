-- Add year column to event_attendees
ALTER TABLE public.event_attendees
    ADD COLUMN IF NOT EXISTS year TEXT;
