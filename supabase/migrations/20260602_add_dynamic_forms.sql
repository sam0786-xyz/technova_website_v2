-- ============================================
-- Dynamic Forms Schema
-- ============================================

-- Create forms table
CREATE TABLE IF NOT EXISTS public.forms (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    title text NOT NULL,
    description text,
    is_active boolean DEFAULT true,
    is_published boolean DEFAULT false,
    allow_edit boolean DEFAULT false,
    show_referral boolean DEFAULT true,
    confirmation_message text,
    deadline timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    created_by uuid REFERENCES next_auth.users(id) ON DELETE SET NULL,
    CONSTRAINT forms_pkey PRIMARY KEY (id)
);

-- Add columns if they don't exist (for existing installs)
DO $$ BEGIN
    ALTER TABLE public.forms ADD COLUMN IF NOT EXISTS is_published boolean DEFAULT false;
    ALTER TABLE public.forms ADD COLUMN IF NOT EXISTS allow_edit boolean DEFAULT false;
    ALTER TABLE public.forms ADD COLUMN IF NOT EXISTS show_referral boolean DEFAULT true;
    ALTER TABLE public.forms ADD COLUMN IF NOT EXISTS confirmation_message text;
END $$;

-- Enable RLS for forms
ALTER TABLE public.forms ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    DROP POLICY IF EXISTS "Public can read active forms" ON public.forms;
    CREATE POLICY "Public can read active forms" ON public.forms
        FOR SELECT USING (is_active = true);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
    
DO $$ BEGIN
    DROP POLICY IF EXISTS "Admins can manage forms" ON public.forms;
    CREATE POLICY "Admins can manage forms" ON public.forms
        FOR ALL USING (
            EXISTS (
                SELECT 1 FROM next_auth.users WHERE id = next_auth.uid() AND role = 'admin'
            )
        );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create form_fields table
-- type can be: 'text', 'textarea', 'number', 'email', 'phone', 'select', 'checkbox', 'section'
CREATE TABLE IF NOT EXISTS public.form_fields (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    form_id uuid NOT NULL REFERENCES public.forms(id) ON DELETE CASCADE,
    label text NOT NULL,
    description text,
    type text NOT NULL,
    options jsonb,
    required boolean DEFAULT false,
    order_index int NOT NULL DEFAULT 0,
    CONSTRAINT form_fields_pkey PRIMARY KEY (id)
);

-- Enable RLS for form_fields
ALTER TABLE public.form_fields ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    DROP POLICY IF EXISTS "Public can read fields of active forms" ON public.form_fields;
    CREATE POLICY "Public can read fields of active forms" ON public.form_fields
        FOR SELECT USING (
            EXISTS (
                SELECT 1 FROM public.forms WHERE id = form_fields.form_id AND is_active = true
            )
        );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    DROP POLICY IF EXISTS "Admins can manage form_fields" ON public.form_fields;
    CREATE POLICY "Admins can manage form_fields" ON public.form_fields
        FOR ALL USING (
            EXISTS (
                SELECT 1 FROM next_auth.users WHERE id = next_auth.uid() AND role = 'admin'
            )
        );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create form_responses table
CREATE TABLE IF NOT EXISTS public.form_responses (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    form_id uuid NOT NULL REFERENCES public.forms(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES next_auth.users(id) ON DELETE CASCADE,
    referrer_id text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT form_responses_pkey PRIMARY KEY (id),
    CONSTRAINT one_response_per_user UNIQUE (form_id, user_id)
);

-- Enable RLS for form_responses
ALTER TABLE public.form_responses ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    DROP POLICY IF EXISTS "Users can view own responses" ON public.form_responses;
    CREATE POLICY "Users can view own responses" ON public.form_responses
        FOR SELECT USING (user_id = next_auth.uid());
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    DROP POLICY IF EXISTS "Users can insert own responses" ON public.form_responses;
    CREATE POLICY "Users can insert own responses" ON public.form_responses
        FOR INSERT WITH CHECK (user_id = next_auth.uid());
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    DROP POLICY IF EXISTS "Users can update own responses" ON public.form_responses;
    CREATE POLICY "Users can update own responses" ON public.form_responses
        FOR UPDATE USING (user_id = next_auth.uid());
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    DROP POLICY IF EXISTS "Admins can manage form_responses" ON public.form_responses;
    CREATE POLICY "Admins can manage form_responses" ON public.form_responses
        FOR ALL USING (
            EXISTS (
                SELECT 1 FROM next_auth.users WHERE id = next_auth.uid() AND role = 'admin'
            )
        );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create form_response_answers table
CREATE TABLE IF NOT EXISTS public.form_response_answers (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    response_id uuid NOT NULL REFERENCES public.form_responses(id) ON DELETE CASCADE,
    field_id uuid NOT NULL REFERENCES public.form_fields(id) ON DELETE CASCADE,
    answer_text text,
    answer_json jsonb,
    CONSTRAINT form_response_answers_pkey PRIMARY KEY (id),
    CONSTRAINT unique_answer_per_field UNIQUE (response_id, field_id)
);

-- Enable RLS for form_response_answers
ALTER TABLE public.form_response_answers ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    DROP POLICY IF EXISTS "Users can view own answers" ON public.form_response_answers;
    CREATE POLICY "Users can view own answers" ON public.form_response_answers
        FOR SELECT USING (
            EXISTS (
                SELECT 1 FROM public.form_responses WHERE id = form_response_answers.response_id AND user_id = next_auth.uid()
            )
        );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    DROP POLICY IF EXISTS "Users can insert own answers" ON public.form_response_answers;
    CREATE POLICY "Users can insert own answers" ON public.form_response_answers
        FOR INSERT WITH CHECK (
            EXISTS (
                SELECT 1 FROM public.form_responses WHERE id = form_response_answers.response_id AND user_id = next_auth.uid()
            )
        );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    DROP POLICY IF EXISTS "Users can update own answers" ON public.form_response_answers;
    CREATE POLICY "Users can update own answers" ON public.form_response_answers
        FOR UPDATE USING (
            EXISTS (
                SELECT 1 FROM public.form_responses WHERE id = form_response_answers.response_id AND user_id = next_auth.uid()
            )
        );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    DROP POLICY IF EXISTS "Admins can manage form_response_answers" ON public.form_response_answers;
    CREATE POLICY "Admins can manage form_response_answers" ON public.form_response_answers
        FOR ALL USING (
            EXISTS (
                SELECT 1 FROM next_auth.users WHERE id = next_auth.uid() AND role = 'admin'
            )
        );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
