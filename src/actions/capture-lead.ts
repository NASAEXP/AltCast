"use server";

import { z } from "zod";
import { insertLead } from "@/lib/supabase";
import { sendLeadCaptureEmail } from "@/lib/resend";

const leadSchema = z.object({
    email: z.string().email(),
    url: z.string().url().optional().or(z.literal("")),
    auditSlug: z.string().optional(),
});

export async function captureLead(email: string, url: string, auditSlug?: string) {
    const result = leadSchema.safeParse({ email, url, auditSlug });

    if (!result.success) {
        return { success: false, error: "Invalid email address" };
    }

    try {
        // Insert lead into Supabase
        await insertLead({
            email,
            url: url || "",
            audit_slug: auditSlug,
        });

        // Send confirmation email via Resend
        if (process.env.RESEND_API_KEY) {
            await sendLeadCaptureEmail({ email, url: url || "Not specified" });
        }

        console.log("🎯 LEAD CAPTURED:", { email, url, auditSlug });

        return { success: true };
    } catch (error) {
        console.error("Failed to capture lead:", error);

        // Still return success if it's just email that failed
        // The lead was captured in the database
        return { success: true, warning: "Email notification may have failed" };
    }
}

