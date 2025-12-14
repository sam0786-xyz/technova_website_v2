'use server'

import { createClient as createServerClient } from "@supabase/supabase-js"
import { auth } from "@/lib/auth"
import { createOrder } from "@/lib/payments/razorpay"
import { revalidatePath } from "next/cache"
import { generateQRToken } from "@/lib/qr/generate"

async function getSupabase() {
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
}

export async function checkRegistration(eventId: string) {
    const session = await auth()
    if (!session) return null

    const supabase = await getSupabase()
    const { data } = await supabase
        .from('registrations')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('event_id', eventId)
        .maybeSingle()

    return data
}

export async function registerForEvent(eventId: string) {
    const session = await auth()
    if (!session) throw new Error("Unauthorized")

    const supabase = await getSupabase()

    // 1. Fetch Event Details
    const { data: event } = await supabase.from('events').select('*').eq('id', eventId).single()
    if (!event) throw new Error("Event not found")

    // 2. Check Capacity
    const { count } = await supabase.from('registrations').select('*', { count: 'exact', head: true }).eq('event_id', eventId)
    if ((count || 0) >= event.capacity) {
        throw new Error("Event Full")
    }

    // 3. Check Existing
    const existing = await checkRegistration(eventId)
    if (existing) throw new Error("Already Registered")

    // 4. Handle Payment Logic
    if (event.price > 0) {
        const order = await createOrder(event.price)
        await supabase.from('registrations').insert({
            user_id: session.user.id,
            event_id: eventId,
            payment_status: 'pending',
            qr_token_id: order.id
        })
        return { status: 'payment_required', order }
    } else {
        // Free Event - Generate QR and Register
        const { token, qrDataUrl } = await generateQRToken(session.user.id!, eventId)

        const { error } = await supabase.from('registrations').insert({
            user_id: session.user.id,
            event_id: eventId,
            payment_status: 'free',
            qr_token_id: token
        })

        if (error) throw new Error(error.message)

        revalidatePath(`/events/${eventId}`)
        return { status: 'success', qrDataUrl }
    }
}

export async function getMyRegistration(eventId: string) {
    const session = await auth()
    if (!session) return null

    const supabase = await getSupabase()
    const { data } = await supabase
        .from('registrations')
        .select('*, events(*)')
        .eq('user_id', session.user.id)
        .eq('event_id', eventId)
        .maybeSingle()

    return data
}
