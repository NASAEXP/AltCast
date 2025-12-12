import { createClient } from "@supabase/supabase-js";

// Types for our database tables
export interface Lead {
    id: string;
    email: string;
    url: string;
    audit_slug?: string;
    created_at: string;
}

export interface AuditRecord {
    id: string;
    slug: string;
    target_url: string;
    status: "clean" | "vulnerable" | "error";
    checks: unknown[];
    score_percentage: number;
    threat_level: string;
    scan_duration: number;
    screenshot?: string;
    lead_id?: string;
    is_public: boolean;
    created_at: string;
}

// Create Supabase client (server-side only)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.warn("⚠️ Supabase credentials not configured. Using fallback mode.");
}

export const supabase = supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : null;

// Helper functions
export async function insertLead(email: string, url: string, auditSlug?: string): Promise<Lead | null> {
    if (!supabase) {
        console.log("📧 [MOCK] Lead captured:", { email, url, auditSlug });
        return null;
    }

    const { data, error } = await supabase
        .from("leads")
        .insert({ email, url, audit_slug: auditSlug })
        .select()
        .single();

    if (error) {
        console.error("Failed to insert lead:", error);
        return null;
    }

    return data;
}

export async function insertAudit(audit: Omit<AuditRecord, "id" | "created_at">): Promise<AuditRecord | null> {
    if (!supabase) {
        console.log("🔍 [MOCK] Audit saved:", audit.slug);
        return null;
    }

    const { data, error } = await supabase
        .from("audits")
        .upsert(audit, { onConflict: "slug" })
        .select()
        .single();

    if (error) {
        console.error("Failed to insert audit:", error);
        return null;
    }

    return data;
}

export async function getAuditBySlugFromSupabase(slug: string): Promise<AuditRecord | null> {
    if (!supabase) {
        return null;
    }

    const { data, error } = await supabase
        .from("audits")
        .select()
        .eq("slug", slug)
        .single();

    if (error) {
        return null;
    }

    return data;
}
