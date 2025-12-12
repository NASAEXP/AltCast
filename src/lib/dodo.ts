/**
 * DodoPayments Integration
 * Documentation: https://docs.dodopayments.com
 * 
 * DodoPayments is used for processing the $299 "Bounty" and $2,500/mo "Night Watch" payments.
 */

const dodoApiKey = process.env.DODO_API_KEY;
const dodoWebhookSecret = process.env.DODO_WEBHOOK_SECRET;

if (!dodoApiKey) {
    console.warn("⚠️ DodoPayments API key not configured. Payments will be mocked.");
}

export interface CreatePaymentLinkParams {
    productName: string;
    amount: number; // in cents
    currency?: string;
    customerEmail?: string;
    metadata?: Record<string, string>;
    successUrl?: string;
    cancelUrl?: string;
}

export interface PaymentLink {
    id: string;
    url: string;
    amount: number;
    currency: string;
    status: "pending" | "completed" | "cancelled";
}

/**
 * Create a payment link for the customer
 */
export async function createPaymentLink(params: CreatePaymentLinkParams): Promise<PaymentLink | null> {
    if (!dodoApiKey) {
        console.log("💳 [MOCK] Would create payment link:", params);
        return {
            id: `mock_${Date.now()}`,
            url: `https://checkout.dodopayments.com/mock?amount=${params.amount}`,
            amount: params.amount,
            currency: params.currency || "USD",
            status: "pending",
        };
    }

    try {
        const response = await fetch("https://api.dodopayments.com/v1/payment-links", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${dodoApiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                product_name: params.productName,
                amount: params.amount,
                currency: params.currency || "USD",
                customer_email: params.customerEmail,
                metadata: params.metadata,
                success_url: params.successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
                cancel_url: params.cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancelled`,
            }),
        });

        if (!response.ok) {
            throw new Error(`DodoPayments API error: ${response.status}`);
        }

        const data = await response.json();
        return {
            id: data.id,
            url: data.url,
            amount: data.amount,
            currency: data.currency,
            status: data.status,
        };
    } catch (error) {
        console.error("Failed to create payment link:", error);
        return null;
    }
}

/**
 * Verify webhook signature from DodoPayments
 */
export function verifyWebhookSignature(payload: string, signature: string): boolean {
    if (!dodoWebhookSecret) {
        console.warn("⚠️ Webhook secret not configured, skipping verification");
        return true; // Allow in dev mode
    }

    // DodoPayments uses HMAC-SHA256 for webhook signatures
    // Implementation depends on their specific format - check their docs
    const crypto = require("crypto");
    const expectedSignature = crypto
        .createHmac("sha256", dodoWebhookSecret)
        .update(payload)
        .digest("hex");

    return signature === expectedSignature;
}

// Product IDs / Price configurations
export const PRODUCTS = {
    BOUNTY: {
        name: "The Bounty - One-Time Hostile Audit",
        amount: 29900, // $299 in cents
        currency: "USD",
    },
    NIGHT_WATCH: {
        name: "The Night Watch - 24/7 Surveillance",
        amount: 250000, // $2,500 in cents
        currency: "USD",
        recurring: "monthly",
    },
} as const;
