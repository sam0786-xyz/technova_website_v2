import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { auth } from '@/lib/auth'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ clubId: string }> }
) {
  try {
    const session = await auth()
    if (!session || session.user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { clubId } = await params
    const supabase = createAdminClient()

    // Fetch admins for the club
    const { data: admins, error } = await supabase
      .from('admin_roles')
      .select('user_id, role')
      .eq('club_id', clubId)

    if (error) {
      console.error('Error fetching club admins:', error)
      return NextResponse.json({ error: 'Failed to fetch admins' }, { status: 500 })
    }

    if (!admins || admins.length === 0) {
      return NextResponse.json({ users: [] })
    }

    const userIds = admins.map(a => a.user_id)
    const { data: users, error: userError } = await supabase
      .schema('next_auth' as unknown as 'public')
      .from('users')
      .select('id, name, email, image, mobile')
      .in('id', userIds)

    if (userError) {
      console.error('Error fetching users:', userError)
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
    }

    return NextResponse.json({ users: users || [] })
  } catch (e) {
    console.error('Error:', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}