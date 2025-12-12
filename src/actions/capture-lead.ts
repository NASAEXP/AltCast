"use server";

import { z } from "zod";
import { insertLead } from "@/lib/supabase";
import { sendWelcomeEmail, sendAuditReportEmail } from "@/lib/resend";

const leadSchema = z.object({
    email: z.string().email(),
    url: z.string(),
    auditSlug: z.string().optional(),
});

interface CaptureLeadResult {
    success: boolean;
    error?: string;
}

export async function captureLead(
    email: string,
    url: string,
    auditSlug?: string
): Promise<CaptureLeadResult> {
    const result = leadSchema.safeParse({ email, url, auditSlug });

    if (!result.success) {
        return { success: false, error: "Invalid email address" };
    }

    try {
        // Insert lead into Supabase
        const lead = await insertLead(email, url, auditSlug);
        console.log("🎯 LEAD CAPTURED:", { email, url, auditSlug, leadId: lead?.id });

        // Send welcome email via Resend
        await sendWelcomeEmail({ to: email });

        return { success: true };
    } catch (error) {
        console.error("Failed to capture lead:", error);
        return { success: false, error: "Failed to save lead" };
    }
}

interface SendReportEmailParams {
    email: string;
    domain: string;
    score: number;
    threatLevel: string;
    auditSlug: string;
}

export async function sendReportEmail(params: SendReportEmailParams): Promise<boolean> {
    try {
        return await sendAuditReportEmail({
            to: params.email,
            domain: params.domain,
            score: params.score,
            threatLevel: params.threatLevel,
            auditSlug: params.auditSlug,
        });
    } catch (error) {
        console.error("Failed to send report email:", error);
        return false;
    }
}

