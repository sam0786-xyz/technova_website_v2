-- Gate entry/exit tracking logs
-- Every QR scan at the gate creates a new row (not a toggle)
CREATE TABLE IF NOT EXISTS public.hackathon_gate_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    participant_id UUID REFERENCES public.hackathon_participants(id) ON DELETE CASCADE NOT NULL,
    direction TEXT NOT NULL CHECK (direction IN ('entry', 'exit')),
    scanned_by TEXT,
    scanned_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE public.hackathon_gate_logs ENABLE ROW LEVEL SECURITY;

-- Allow service_role full access (backend uses service role key)
-- No public read needed — only accessed via server actions
CREATE INDEX IF NOT EXISTS idx_gate_logs_participant ON public.hackathon_gate_logs(participant_id);
CREATE INDEX IF NOT EXISTS idx_gate_logs_scanned_at ON public.hackathon_gate_logs(scanned_at);
