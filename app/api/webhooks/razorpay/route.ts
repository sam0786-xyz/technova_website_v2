import { headers } from "next/headers"
import crypto from "crypto"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
    const body = await req.text()
    const headersList = await headers()
    const signature = headersList.get("x-razorpay-signature")

    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET || "test_secret")
        .update(body)
        .digest("hex")

    if (expectedSignature !== signature) {
        console.error("Invalid Razorpay Signature")
        return new Response("Invalid signature", { status: 400 })
    }

    const event = JSON.parse(body)

    if (event.event === "payment.captured") {
        const payment = event.payload.payment.entity
        const order_id = payment.order_id

        // Find registration by order_id (stored in qr_token_id as per previous hack, or use metadata)
        // Proper way: Store order_id in metadata of payment and use it. or Query DB.

        // Attempt to match
        const { data: reg } = await supabase
            .from("registrations")
            .select("*")
            .eq("qr_token_id", order_id)
            .single()

        if (reg) {
            await supabase
                .from("registrations")
                .update({ payment_status: 'paid' })
                .eq("id", reg.id)
        }
    }

    return new Response("OK", { status: 200 })
}
