import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/dodo";

export async function POST(request: NextRequest) {
    try {
        const payload = await request.text();
        const signature = request.headers.get("x-dodo-signature") || "";

        // Verify webhook signature
        if (!verifyWebhookSignature(payload, signature)) {
            console.error("Invalid webhook signature");
            return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
        }

        const event = JSON.parse(payload);

        console.log("📦 DodoPayments webhook received:", event.type);

        switch (event.type) {
            case "payment.completed":
                await handlePaymentCompleted(event.data);
                break;
            case "payment.failed":
                await handlePaymentFailed(event.data);
                break;
            case "subscription.created":
                await handleSubscriptionCreated(event.data);
                break;
            case "subscription.cancelled":
                await handleSubscriptionCancelled(event.data);
                break;
            default:
                console.log("Unhandled event type:", event.type);
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error("Webhook error:", error);
        return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
    }
}

async function handlePaymentCompleted(data: {
    payment_id: string;
    customer_email?: string;
    amount: number;
    metadata?: Record<string, string>;
}) {
    console.log("✅ Payment completed:", data.payment_id);

    // TODO: Insert payment record into Supabase
    // TODO: Trigger audit if this is a "Bounty" purchase
    // TODO: Send confirmation email via Resend

    // For now, just log
    console.log("Payment data:", {
        id: data.payment_id,
        email: data.customer_email,
        amount: data.amount,
        metadata: data.metadata,
    });
}

async function handlePaymentFailed(data: { payment_id: string; reason?: string }) {
    console.log("❌ Payment failed:", data.payment_id, data.reason);
}

async function handleSubscriptionCreated(data: {
    subscription_id: string;
    customer_email?: string;
}) {
    console.log("🔄 Subscription created:", data.subscription_id);
    // TODO: Enable "Night Watch" features for this customer
}

async function handleSubscriptionCancelled(data: { subscription_id: string }) {
    console.log("🔄 Subscription cancelled:", data.subscription_id);
    // TODO: Disable "Night Watch" features for this customer
}

// Disable body parsing for webhooks (we need raw body for signature verification)
export const config = {
    api: {
        bodyParser: false,
    },
};
