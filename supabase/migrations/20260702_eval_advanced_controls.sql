-- Add evaluations_open to forms
ALTER TABLE public.forms ADD COLUMN IF NOT EXISTS evaluations_open BOOLEAN DEFAULT true;

-- Add locking and unlock status to form_evaluations
ALTER TABLE public.form_evaluations ADD COLUMN IF NOT EXISTS is_locked BOOLEAN DEFAULT false;
ALTER TABLE public.form_evaluations ADD COLUMN IF NOT EXISTS unlock_status TEXT DEFAULT 'none';
-- Statuses for unlock_status can be: 'none', 'pending', 'approved', 'declined'
