-- Add attendance event settings columns to hackathon_settings
ALTER TABLE public.hackathon_settings
    ADD COLUMN IF NOT EXISTS attendance_event_tag TEXT DEFAULT 'general',
    ADD COLUMN IF NOT EXISTS attendance_event_name TEXT DEFAULT 'Event';

-- Allow public insert/update on event_attendees (for self-registration form)
CREATE POLICY "Allow public update event_attendees" ON public.event_attendees
    FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow public insert event_attendance_scans" ON public.event_attendance_scans
    FOR INSERT WITH CHECK (true);
