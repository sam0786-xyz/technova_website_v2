-- ============================================
-- Form Evaluation System
-- For club nomination / interview evaluations
-- ============================================

-- Evaluation criteria config on the form
DO $$ BEGIN
    ALTER TABLE public.forms ADD COLUMN IF NOT EXISTS evaluation_criteria JSONB;
END $$;

-- Evaluators for a specific form
CREATE TABLE IF NOT EXISTS public.form_evaluators (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    form_id UUID REFERENCES public.forms(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    magic_token TEXT UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(form_id, email)
);

-- Individual evaluations (one per evaluator per candidate)
CREATE TABLE IF NOT EXISTS public.form_evaluations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    form_id UUID REFERENCES public.forms(id) ON DELETE CASCADE NOT NULL,
    evaluator_id UUID REFERENCES public.form_evaluators(id) ON DELETE CASCADE NOT NULL,
    response_id UUID REFERENCES public.form_responses(id) ON DELETE CASCADE NOT NULL,
    scores JSONB NOT NULL DEFAULT '{}',
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(evaluator_id, response_id)
);

-- RLS
ALTER TABLE public.form_evaluators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_evaluations ENABLE ROW LEVEL SECURITY;

-- Admins can manage evaluators
DO $$ BEGIN
    DROP POLICY IF EXISTS "Admins can manage form_evaluators" ON public.form_evaluators;
    CREATE POLICY "Admins can manage form_evaluators" ON public.form_evaluators
        FOR ALL USING (
            EXISTS (
                SELECT 1 FROM next_auth.users WHERE id = next_auth.uid() AND role IN ('admin', 'super_admin')
            )
        );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Public can read evaluators for their form (for magic token lookup)
DO $$ BEGIN
    DROP POLICY IF EXISTS "Public can read form_evaluators by token" ON public.form_evaluators;
    CREATE POLICY "Public can read form_evaluators by token" ON public.form_evaluators
        FOR SELECT USING (true);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Admins can manage evaluations
DO $$ BEGIN
    DROP POLICY IF EXISTS "Admins can manage form_evaluations" ON public.form_evaluations;
    CREATE POLICY "Admins can manage form_evaluations" ON public.form_evaluations
        FOR ALL USING (
            EXISTS (
                SELECT 1 FROM next_auth.users WHERE id = next_auth.uid() AND role IN ('admin', 'super_admin')
            )
        );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Evaluators can manage their own evaluations
DO $$ BEGIN
    DROP POLICY IF EXISTS "Evaluators can manage own evaluations" ON public.form_evaluations;
    CREATE POLICY "Evaluators can manage own evaluations" ON public.form_evaluations
        FOR ALL USING (true);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
