import { createClient } from "@supabase/supabase-js";

// TODO: Generate types with: npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/supabase.ts
// import { Database } from "@/types/supabase";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client-side Supabase client (uses anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side Supabase client (uses service role key for admin operations)
export function createServerClient() {
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    return createClient(supabaseUrl, serviceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
}

// ==================== TABLE TYPES ====================
// These will be replaced by generated types from Supabase CLI

export interface LeadRecord {
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
    domain: string;
    score: number;
    grade: string;
    threat_level: string;
    checks: Record<string, unknown>[];
    screenshot?: string;
    scan_duration: number;
    completed_at: string;
    lead_id?: string;
    is_public: boolean;
}

// ==================== QUERIES ====================

export async function getAudits(limit = 50) {
    const { data, error } = await supabase
        .from("audits")
        .select("*")
        .order("completed_at", { ascending: false })
        .limit(limit);

    if (error) throw error;
    return data as AuditRecord[];
}

export async function getAuditBySlug(slug: string) {
    const { data, error } = await supabase
        .from("audits")
        .select("*")
        .eq("slug", slug)
        .single();

    if (error && error.code !== "PGRST116") throw error; // PGRST116 = not found
    return data as AuditRecord | null;
}

export async function insertAudit(audit: Omit<AuditRecord, "id">) {
    const db = createServerClient();
    const { data, error } = await db
        .from("audits")
        .insert(audit)
        .select()
        .single();

    if (error) throw error;
    return data as AuditRecord;
}

export async function insertLead(lead: Omit<LeadRecord, "id" | "created_at">) {
    const db = createServerClient();
    const { data, error } = await db
        .from("leads")
        .insert(lead)
        .select()
        .single();

    if (error) throw error;
    return data as LeadRecord;
}

export async function getLeaderboard(limit = 50) {
    const { data, error } = await supabase
        .from("audits")
        .select("id, slug, domain, score, grade, threat_level, scan_duration, completed_at")
        .eq("is_public", true)
        .order("score", { ascending: false })
        .limit(limit);

    if (error) throw error;
    return data;
}
