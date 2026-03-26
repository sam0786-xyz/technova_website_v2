-- Event Attendees (students imported via CSV for attendance tracking)
CREATE TABLE IF NOT EXISTS public.event_attendees (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    mobile TEXT,
    system_id TEXT,
    section TEXT,
    department TEXT,
    college TEXT DEFAULT 'Sharda University',
    qr_code TEXT UNIQUE DEFAULT gen_random_uuid()::TEXT,
    qr_emailed BOOLEAN DEFAULT false,
    event_tag TEXT DEFAULT 'general',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Attendance Scans (each checkpoint scan = 1 row)
CREATE TABLE IF NOT EXISTS public.event_attendance_scans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    attendee_id UUID REFERENCES public.event_attendees(id) ON DELETE CASCADE NOT NULL,
    checkpoint TEXT NOT NULL,
    scanned_by TEXT,
    scanned_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(attendee_id, checkpoint)
);

-- RLS
ALTER TABLE public.event_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_attendance_scans ENABLE ROW LEVEL SECURITY;

-- Public read for attendees (so scanner page can verify)
CREATE POLICY "Allow read event_attendees" ON public.event_attendees FOR SELECT USING (true);
CREATE POLICY "Allow read event_attendance_scans" ON public.event_attendance_scans FOR SELECT USING (true);

-- Add attendance checkpoints to hackathon_settings
ALTER TABLE public.hackathon_settings
    ADD COLUMN IF NOT EXISTS attendance_checkpoints TEXT[] DEFAULT ARRAY['Registration', 'Food', 'Exit'];
