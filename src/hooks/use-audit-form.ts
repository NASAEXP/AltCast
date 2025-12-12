"use client";

import { useState, useCallback, useTransition } from "react";
import { runLightAudit, type LightAuditResult } from "@/actions/light-audit";
import { captureLead } from "@/actions/capture-lead";

export type AuditState =
    | "idle"           // Waiting for URL input
    | "scanning"       // Server Action running (show loading theatre)
    | "results"        // Vulns found, show partial/blurred results
    | "email_gate"     // Prompt for email to unlock full report
    | "captured";      // Success, redirect to report page

interface Vulnerability {
    code: string;
    severity: "critical" | "warning" | "info";
    description: string;
}

// Extend the server result with local UI state
type AuditUIResult = Partial<LightAuditResult> & {
    state: AuditState;
    vulnerabilities: Vulnerability[];
};

export function useAuditForm() {
    const [url, setUrl] = useState("");
    const [result, setResult] = useState<AuditUIResult>({
        state: "idle",
        vulnerabilities: []
    });
    // Separate state just for slug to avoid closure issues
    const [auditSlug, setAuditSlug] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const handleAudit = useCallback(() => {
        if (!url.trim()) return;

        // Reset slug
        setAuditSlug(null);

        // Switch to scanning immediately
        setResult(prev => ({ ...prev, state: "scanning" }));

        startTransition(async () => {
            try {
                const data = await runLightAudit(url);

                // Store slug separately
                console.log("[AltCast] Audit complete, slug:", data.slug);
                setAuditSlug(data.slug || null);

                setResult({
                    state: "results",
                    ...data
                });
            } catch (e) {
                console.error("Audit failed", e);
                setResult(prev => ({ ...prev, state: "results", vulnerabilities: [] }));
            }
        });
    }, [url]);

    // Pass the slug explicitly to unlockReport
    const unlockReport = useCallback(async (email: string, currentSlug?: string) => {
        if (!email) return;

        console.log("[AltCast] Unlock clicked, slug param:", currentSlug, "state slug:", auditSlug);

        await captureLead(email, url);
        setResult(prev => ({ ...prev, state: "captured" }));

        // Use passed slug or fall back to state
        const slugToUse = currentSlug || auditSlug;

        // Redirect after showing success state
        if (slugToUse) {
            setTimeout(() => {
                console.log("[AltCast] Redirecting to /audit/" + slugToUse);
                window.location.assign("/audit/" + slugToUse);
            }, 2000);
        } else {
            console.error("[AltCast] No slug available for redirect");
        }
    }, [url, auditSlug]);

    return { url, setUrl, result, auditSlug, handleAudit, unlockReport, isPending };
}
