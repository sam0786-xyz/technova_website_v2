import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { auth } from '@/lib/auth'
import * as XLSX from 'xlsx'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
    try {
        // 1. Auth check
        const session = await auth()
        if (!session || !['admin', 'super_admin'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // 2. Get formId from query
        const { searchParams } = new URL(req.url)
        const formId = searchParams.get('formId')

        if (!formId) {
            return NextResponse.json({ error: 'Missing formId parameter' }, { status: 400 })
        }

        // 3. Get form details
        const { data: form, error: formError } = await supabase
            .from('event_feedback_forms')
            .select('*, questions:feedback_questions(*), event:events(title)')
            .eq('id', formId)
            .single()

        if (formError || !form) {
            return NextResponse.json({ error: 'Feedback form not found' }, { status: 404 })
        }

        // 4. Get responses
        const { data: responses, error: respError } = await supabase
            .from('feedback_responses')
            .select('*')
            .eq('form_id', formId)
            .order('submitted_at', { ascending: false })

        if (respError) {
            return NextResponse.json({ error: 'Failed to fetch responses' }, { status: 500 })
        }

        // 5. Get user details
        const userIds = responses?.map(r => r.user_id) || []
        let users: any[] = []

        if (userIds.length > 0) {
            const { data: usersData } = await supabase
                .schema('next_auth')
                .from('users')
                .select('id, name, email, system_id, year, course, section')
                .in('id', userIds)
            users = usersData || []
        }

        // 6. Build Excel data
        const questions = form.questions?.sort((a: any, b: any) => a.order_index - b.order_index) || []

        // Headers: basic info + questions
        const headers = [
            'Name',
            'Email',
            'System ID',
            'Year',
            'Course',
            'Section',
            'Submitted At',
            ...questions.map((q: any) => q.label)
        ]

        // Data rows
        const rows = (responses || []).map(resp => {
            const user = users.find(u => u.id === resp.user_id) || {}
            const answers = resp.answers || {}

            return [
                user.name || 'Unknown',
                user.email || '',
                user.system_id || '',
                user.year || '',
                user.course || '',
                user.section || '',
                new Date(resp.submitted_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
                ...questions.map((q: any) => {
                    const answer = answers[q.id]
                    if (Array.isArray(answer)) {
                        return answer.join(', ')
                    }
                    return answer !== undefined && answer !== null ? String(answer) : ''
                })
            ]
        })

        // 7. Create workbook
        const wb = XLSX.utils.book_new()
        const wsData = [headers, ...rows]
        const ws = XLSX.utils.aoa_to_sheet(wsData)

        // Set column widths
        ws['!cols'] = headers.map(() => ({ wch: 20 }))

        const eventTitle = (form.event?.title || 'Event').replace(/[^a-zA-Z0-9]/g, '_')
        const dayLabel = form.day_number ? `_Day${form.day_number}` : ''
        const sheetName = `Feedback${dayLabel}`.substring(0, 31) // Excel sheet name limit

        XLSX.utils.book_append_sheet(wb, ws, sheetName)

        // 8. Generate buffer
        const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })

        // 9. Return file
        const filename = `${eventTitle}${dayLabel}_Feedback_${new Date().toISOString().split('T')[0]}.xlsx`

        return new NextResponse(buffer, {
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': `attachment; filename="${filename}"`,
            },
        })

    } catch (err) {
        console.error('Export Error:', err)
        return NextResponse.json({ error: 'Export failed' }, { status: 500 })
    }
}
