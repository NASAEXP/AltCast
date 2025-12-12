import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAuditBySlug } from "@/lib/database";
import { SecurityReportPage } from "@/components/security-report-page";

interface Props {
    params: Promise<{ slug: string }>;
}

// 🔥 SEO WEAPONIZATION: Dynamic metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const audit = await getAuditBySlug(slug);

    if (!audit) return { title: "Audit Not Found - AltCast" };

    // Handle both data structures
    const vulns = (audit as Record<string, unknown>).checks || audit.vulnerabilities || [];
    const vulnCount = vulns.length;
    const hasCritical = vulns.some((v: Record<string, unknown>) =>
        v.severity === "critical" || (v.status === "fail" && v.severity !== "info")
    );
    const severity = hasCritical ? "CRITICAL RISK" : "WARNING";
    const domain = new URL(audit.targetUrl).hostname;

    return {
        title: `${domain} Security Audit | ${vulnCount} Checks Performed`,
        description: `AltCast hostile audit of ${audit.targetUrl}. ${severity}: Security assessment completed.`,
        openGraph: {
            title: `🔴 ${domain} - Security Assessment by AltCast`,
            description: `Public security audit report. ${vulnCount} security checks performed.`,
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

// Transform database audit to SecurityReportPage format
function transformAuditToReport(audit: NonNullable<Awaited<ReturnType<typeof getAuditBySlug>>>) {
    const domain = new URL(audit.targetUrl).hostname;

    // Handle both data structures: some audits have 'checks', others have 'vulnerabilities'
    const auditData = audit as Record<string, unknown>;
    const checksArray = (auditData.checks || audit.vulnerabilities || []) as Array<{
        id?: string;
        code: string;
        name?: string;
        status?: string;
        severity: string;
        description: string;
    }>;

    // Calculate stats from checks - handle both formats
    const criticalCount = checksArray.filter(c => c.severity === "critical").length;
    const warningCount = checksArray.filter(c => c.severity === "warning").length;
    const infoCount = checksArray.filter(c => c.severity === "info").length;

    // Calculate grade based on check results
    let grade: "S" | "A+" | "A" | "B+" | "B" | "C+" | "C" | "F";
    let score: number;

    // Use scorePercentage from new audit format, or legacy score.percentage
    const auditScore = (auditData.scorePercentage as number) ??
        (auditData.score as { percentage?: number })?.percentage;

    if (auditScore !== undefined && auditScore > 0) {
        score = auditScore;
        if (score >= 95) grade = "S";
        else if (score >= 90) grade = "A+";
        else if (score >= 85) grade = "A";
        else if (score >= 75) grade = "B+";
        else if (score >= 65) grade = "B";
        else if (score >= 50) grade = "C+";
        else if (score >= 30) grade = "C";
        else grade = "F";
    } else {
        // Fallback calculation based on counts
        if (criticalCount >= 2) {
            grade = "F"; score = Math.max(10, 30 - criticalCount * 10);
        } else if (criticalCount === 1) {
            grade = "C"; score = 45;
        } else if (warningCount >= 4) {
            grade = "C+"; score = 55;
        } else if (warningCount >= 3) {
            grade = "B"; score = 65;
        } else if (warningCount >= 2) {
            grade = "B+"; score = 75;
        } else if (warningCount >= 1) {
            grade = "A"; score = 85;
        } else {
            grade = "S"; score = 100;
        }
    }

    // Determine threat level based on score
    const threatLevel = (auditData.threatLevel as string) ||
        (criticalCount > 0 ? "CRITICAL" : warningCount > 2 ? "HIGH" : warningCount > 0 ? "MEDIUM" : "LOW");

    // Transform checks to findings format
    const findings = checksArray.map((c, i) => ({
        id: c.id || String(i + 1),
        code: c.code.replace(/[\[\]]/g, ''), // Remove brackets from code
        name: c.name || c.code,
        severity: mapSeverity(c.severity),
        status: mapStatus(c.status),
        description: c.description,
    }));

    return {
        target: audit.targetUrl,
        domain,
        grade,
        score,
        latency: audit.scanDuration,
        uptime: 99.5,
        threatLevel: threatLevel as "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
        findings,
        screenshot: audit.screenshot || "",
        completedAt: audit.completedAt,
    };
}

function mapSeverity(severity: string): "critical" | "high" | "medium" | "low" | "info" {
    switch (severity) {
        case "critical": return "critical";
        case "high": return "high";
        case "warning":
        case "medium": return "medium";
        case "low": return "low";
        case "info":
        case "none":
        default: return "info";
    }
}

function mapStatus(status?: string): "PASS" | "FAIL" | "INFO" {
    switch (status) {
        case "pass": return "PASS";
        case "fail": return "FAIL";
        default: return "INFO";
    }
}

export default async function AuditReportPage({ params }: Props) {
    const { slug } = await params;
    const audit = await getAuditBySlug(slug);

    if (!audit) notFound();

    const report = transformAuditToReport(audit);

    return (
        <>
            <SecurityReportPage report={report} />

            {/* JSON-LD Schema for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "TechArticle",
                        "headline": `${report.domain} Security Audit Report`,
                        "description": `Security assessment with grade ${report.grade}`,
                        "author": {
                            "@type": "Organization",
                            "name": "AltCast"
                        },
                        "datePublished": audit.completedAt,
                    }),
                }}
            />
        </>
    );
}
