"use server";

import { z } from "zod";

const leadSchema = z.object({
    email: z.string().email(),
    url: z.string(), // Relaxed validation as it might come from state
});

export async function captureLead(email: string, url: string) {
    const result = leadSchema.safeParse({ email, url });

    if (!result.success) {
        return { success: false, error: "Invalid email address" };
    }

    // TODO: Insert into Supabase
    // await db.insert(leads).values({ email, url });

    // TODO: Trigger Resend email

    console.log("🎯 LEAD CAPTURED:", { email, url });

    // Simulate DB delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return { success: true };
}
