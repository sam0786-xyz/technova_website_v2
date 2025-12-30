import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const formId = searchParams.get('formId')

        if (!formId) {
            return NextResponse.json({ error: 'Missing formId parameter' }, { status: 400 })
        }

        // Get questions for the form
        const { data: questions, error } = await supabase
            .from('feedback_questions')
            .select('*')
            .eq('form_id', formId)
            .order('order_index', { ascending: true })

        if (error) {
            console.error('Get Questions Error:', error)
            return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 })
        }

        return NextResponse.json({ questions: questions || [] })
    } catch (err) {
        console.error('Questions API Error:', err)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}
