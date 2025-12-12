"use server";

import { saveAudit } from "@/lib/database";

// ==================== TYPES ====================
export interface SecurityCheck {
    code: string;
    name: string;
    severity: "critical" | "warning" | "info";
    description: string;
    points: number;
    maxPoints: number;
}

export interface LightAuditResult {
    status: "clean" | "vulnerable" | "error";
    slug?: string;
    vulnerabilities: SecurityCheck[];
    scanDuration: number;
    screenshot?: string;
    siteType: "spa" | "static" | "dynamic" | "api" | "unknown";
    industryCategory: "fintech" | "ecommerce" | "saas" | "marketing" | "unknown";
    totalScore: number;
    maxScore: number;
    scorePercentage: number;
}

// ==================== SCORING WEIGHTS ====================
const WEIGHTS = {
    XSS_PROTECTION: { max: 15, pass: 15, partial: 8, fail: 0 },
    CLICKJACKING: { max: 15, pass: 15, partial: 8, fail: 0 },
    TRANSPORT_SECURITY: { max: 15, pass: 15, partial: 8, fail: 0 },
    MIME_SNIFFING: { max: 10, pass: 10, partial: 5, fail: 0 },
    SERVER_DISCLOSURE: { max: 5, pass: 5, partial: 3, fail: 0 },
    FRAMEWORK_EXPOSURE: { max: 5, pass: 5, partial: 3, fail: 0 },
    REFERRER_POLICY: { max: 10, pass: 10, partial: 5, fail: 0 },
    SECURITY_TXT: { max: 10, pass: 10, partial: 5, fail: 0 },
    ROBOTS_TXT: { max: 5, pass: 5, partial: 3, fail: 0 },
    PERMISSIONS_POLICY: { max: 10, pass: 10, partial: 5, fail: 0 },
};

// ==================== MAIN FUNCTION ====================
export async function runLightAudit(url: string): Promise<LightAuditResult> {
    const startTime = Date.now();

    // Normalize URL
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
    }

    const slug = generateSlug(url);

    try {
        new URL(url);
    } catch {
        return createErrorResult(slug, Date.now() - startTime);
    }

    try {
        const checks: SecurityCheck[] = [];
        let totalScore = 0;
        let maxScore = 0;

        // Fetch main page with timeout
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(url, {
            signal: controller.signal,
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; AltCast-Scanner/1.0; +https://altcast.io)',
            },
            redirect: 'follow',
        });
        clearTimeout(timeout);

        const headers: Record<string, string> = {};
        response.headers.forEach((value, key) => {
            headers[key.toLowerCase()] = value;
        });

        const html = await response.text();
        const urlObj = new URL(url);
        const baseUrl = `${urlObj.protocol}//${urlObj.host}`;

        // Detect site type and industry
        const siteType = detectSiteType(html);
        const industryCategory = detectIndustry(url, html);

        // ==================== SECURITY CHECKS ====================

        // 1. Content Security Policy
        const hasCSP = !!headers["content-security-policy"];
        const hasXSSHeader = !!headers["x-xss-protection"];
        if (hasCSP) {
            checks.push(createCheck("XSS_PROTECTION", "info", "Content-Security-Policy header present", WEIGHTS.XSS_PROTECTION.pass, WEIGHTS.XSS_PROTECTION.max));
            totalScore += WEIGHTS.XSS_PROTECTION.pass;
        } else if (hasXSSHeader) {
            checks.push(createCheck("XSS_PROTECTION", "info", "Legacy X-XSS-Protection present (CSP recommended)", WEIGHTS.XSS_PROTECTION.partial, WEIGHTS.XSS_PROTECTION.max));
            totalScore += WEIGHTS.XSS_PROTECTION.partial;
        } else if (siteType === "static") {
            checks.push(createCheck("XSS_PROTECTION", "info", "No CSP (acceptable for static site)", WEIGHTS.XSS_PROTECTION.partial, WEIGHTS.XSS_PROTECTION.max));
            totalScore += WEIGHTS.XSS_PROTECTION.partial;
        } else {
            checks.push(createCheck("XSS_PROTECTION", "warning", "No Content-Security-Policy header", WEIGHTS.XSS_PROTECTION.fail, WEIGHTS.XSS_PROTECTION.max));
        }
        maxScore += WEIGHTS.XSS_PROTECTION.max;

        // 2. Clickjacking Protection
        const hasXFrameOptions = !!headers["x-frame-options"];
        const hasFrameAncestors = headers["content-security-policy"]?.includes("frame-ancestors");
        if (hasXFrameOptions || hasFrameAncestors) {
            checks.push(createCheck("CLICKJACKING", "info", "Frame embedding protection enabled", WEIGHTS.CLICKJACKING.pass, WEIGHTS.CLICKJACKING.max));
            totalScore += WEIGHTS.CLICKJACKING.pass;
        } else if (siteType === "static" || siteType === "api") {
            checks.push(createCheck("CLICKJACKING", "info", `No frame protection (acceptable for ${siteType} site)`, WEIGHTS.CLICKJACKING.partial, WEIGHTS.CLICKJACKING.max));
            totalScore += WEIGHTS.CLICKJACKING.partial;
        } else {
            checks.push(createCheck("CLICKJACKING", "warning", "Missing X-Frame-Options or frame-ancestors", WEIGHTS.CLICKJACKING.fail, WEIGHTS.CLICKJACKING.max));
        }
        maxScore += WEIGHTS.CLICKJACKING.max;

        // 3. HSTS
        const hasHSTS = !!headers["strict-transport-security"];
        const isHTTPS = url.startsWith("https");
        if (hasHSTS) {
            checks.push(createCheck("TRANSPORT_SECURITY", "info", "HSTS header enforces secure connections", WEIGHTS.TRANSPORT_SECURITY.pass, WEIGHTS.TRANSPORT_SECURITY.max));
            totalScore += WEIGHTS.TRANSPORT_SECURITY.pass;
        } else if (isHTTPS) {
            checks.push(createCheck("TRANSPORT_SECURITY", "warning", "HTTPS present but no HSTS header", WEIGHTS.TRANSPORT_SECURITY.partial, WEIGHTS.TRANSPORT_SECURITY.max));
            totalScore += WEIGHTS.TRANSPORT_SECURITY.partial;
        } else {
            checks.push(createCheck("TRANSPORT_SECURITY", "warning", "No HTTPS detected", WEIGHTS.TRANSPORT_SECURITY.fail, WEIGHTS.TRANSPORT_SECURITY.max));
        }
        maxScore += WEIGHTS.TRANSPORT_SECURITY.max;

        // 4. MIME Sniffing
        const hasNoSniff = headers["x-content-type-options"]?.includes("nosniff");
        if (hasNoSniff) {
            checks.push(createCheck("MIME_SNIFFING", "info", "X-Content-Type-Options: nosniff enabled", WEIGHTS.MIME_SNIFFING.pass, WEIGHTS.MIME_SNIFFING.max));
            totalScore += WEIGHTS.MIME_SNIFFING.pass;
        } else {
            checks.push(createCheck("MIME_SNIFFING", "warning", "MIME type sniffing protection not enabled", WEIGHTS.MIME_SNIFFING.fail, WEIGHTS.MIME_SNIFFING.max));
        }
        maxScore += WEIGHTS.MIME_SNIFFING.max;

        // 5. Server Disclosure (Informational - always full points)
        const serverHeader = headers["server"];
        if (!serverHeader) {
            checks.push(createCheck("SERVER_DISCLOSURE", "info", "Server banner not disclosed", WEIGHTS.SERVER_DISCLOSURE.pass, WEIGHTS.SERVER_DISCLOSURE.max));
            totalScore += WEIGHTS.SERVER_DISCLOSURE.pass;
        } else {
            // Still informational, still full points - just noting what we found
            checks.push(createCheck("SERVER_DISCLOSURE", "info", `Server: ${serverHeader} (informational)`, WEIGHTS.SERVER_DISCLOSURE.pass, WEIGHTS.SERVER_DISCLOSURE.max));
            totalScore += WEIGHTS.SERVER_DISCLOSURE.pass;
        }
        maxScore += WEIGHTS.SERVER_DISCLOSURE.max;

        // 6. Framework Exposure (Informational - always full points)
        const poweredBy = headers["x-powered-by"];
        if (!poweredBy) {
            checks.push(createCheck("FRAMEWORK_EXPOSURE", "info", "No framework fingerprint in headers", WEIGHTS.FRAMEWORK_EXPOSURE.pass, WEIGHTS.FRAMEWORK_EXPOSURE.max));
            totalScore += WEIGHTS.FRAMEWORK_EXPOSURE.pass;
        } else {
            // Informational, still full points
            checks.push(createCheck("FRAMEWORK_EXPOSURE", "info", `Framework: ${poweredBy} (informational)`, WEIGHTS.FRAMEWORK_EXPOSURE.pass, WEIGHTS.FRAMEWORK_EXPOSURE.max));
            totalScore += WEIGHTS.FRAMEWORK_EXPOSURE.pass;
        }
        maxScore += WEIGHTS.FRAMEWORK_EXPOSURE.max;

        // 7. Referrer-Policy (NEW)
        const hasReferrer = !!headers["referrer-policy"];
        if (hasReferrer) {
            checks.push(createCheck("REFERRER_POLICY", "info", `Referrer-Policy: ${headers["referrer-policy"]}`, WEIGHTS.REFERRER_POLICY.pass, WEIGHTS.REFERRER_POLICY.max));
            totalScore += WEIGHTS.REFERRER_POLICY.pass;
        } else {
            checks.push(createCheck("REFERRER_POLICY", "warning", "No Referrer-Policy header", WEIGHTS.REFERRER_POLICY.fail, WEIGHTS.REFERRER_POLICY.max));
        }
        maxScore += WEIGHTS.REFERRER_POLICY.max;

        // 8. Permissions-Policy (NEW - informational, always full points)
        const hasPermissions = !!headers["permissions-policy"] || !!headers["feature-policy"];
        if (hasPermissions) {
            checks.push(createCheck("PERMISSIONS_POLICY", "info", "Permissions-Policy header present", WEIGHTS.PERMISSIONS_POLICY.pass, WEIGHTS.PERMISSIONS_POLICY.max));
            totalScore += WEIGHTS.PERMISSIONS_POLICY.pass;
        } else {
            // Optional header - still full points since it's not a security issue
            checks.push(createCheck("PERMISSIONS_POLICY", "info", "No Permissions-Policy header (optional)", WEIGHTS.PERMISSIONS_POLICY.pass, WEIGHTS.PERMISSIONS_POLICY.max));
            totalScore += WEIGHTS.PERMISSIONS_POLICY.pass;
        }
        maxScore += WEIGHTS.PERMISSIONS_POLICY.max;

        // 9. security.txt (NEW)
        const securityTxtResult = await checkSecurityTxt(baseUrl);
        if (securityTxtResult.exists) {
            checks.push(createCheck("SECURITY_TXT", "info", "security.txt file present", WEIGHTS.SECURITY_TXT.pass, WEIGHTS.SECURITY_TXT.max));
            totalScore += WEIGHTS.SECURITY_TXT.pass;
        } else {
            checks.push(createCheck("SECURITY_TXT", "info", "No security.txt file (recommended)", WEIGHTS.SECURITY_TXT.partial, WEIGHTS.SECURITY_TXT.max));
            totalScore += WEIGHTS.SECURITY_TXT.partial;
        }
        maxScore += WEIGHTS.SECURITY_TXT.max;

        // 10. robots.txt (NEW)
        const robotsTxtResult = await checkRobotsTxt(baseUrl);
        if (robotsTxtResult.exists && !robotsTxtResult.exposesSensitive) {
            checks.push(createCheck("ROBOTS_TXT", "info", "robots.txt present and clean", WEIGHTS.ROBOTS_TXT.pass, WEIGHTS.ROBOTS_TXT.max));
            totalScore += WEIGHTS.ROBOTS_TXT.pass;
        } else if (robotsTxtResult.exposesSensitive) {
            checks.push(createCheck("ROBOTS_TXT", "warning", "robots.txt may expose sensitive paths", WEIGHTS.ROBOTS_TXT.fail, WEIGHTS.ROBOTS_TXT.max));
        } else {
            checks.push(createCheck("ROBOTS_TXT", "info", "No robots.txt file", WEIGHTS.ROBOTS_TXT.partial, WEIGHTS.ROBOTS_TXT.max));
            totalScore += WEIGHTS.ROBOTS_TXT.partial;
        }
        maxScore += WEIGHTS.ROBOTS_TXT.max;

        // Industry benchmark adjustment
        if (industryCategory === "fintech") {
            const hasCriticalHeaders = hasCSP && hasHSTS && hasXFrameOptions;
            if (!hasCriticalHeaders) {
                totalScore = Math.floor(totalScore * 0.9);
            }
        }

        const scorePercentage = Math.round((totalScore / maxScore) * 100);
        const hasCritical = checks.some(c => c.severity === "critical");
        const hasWarnings = checks.some(c => c.severity === "warning");

        const result: LightAuditResult = {
            status: hasCritical ? "vulnerable" : hasWarnings ? "vulnerable" : "clean",
            slug,
            vulnerabilities: checks,
            scanDuration: Date.now() - startTime,
            siteType,
            industryCategory,
            totalScore,
            maxScore,
            scorePercentage,
        };

        await saveAudit({
            id: crypto.randomUUID(),
            targetUrl: url,
            completedAt: new Date().toISOString(),
            ...result
        });

        return result;

    } catch (error) {
        console.error("Audit failed:", error);
        return createErrorResult(slug, Date.now() - startTime);
    }
}

// ==================== HELPER FUNCTIONS ====================

function createCheck(
    code: string,
    severity: "critical" | "warning" | "info",
    description: string,
    points: number,
    maxPoints: number
): SecurityCheck {
    const cweMap: Record<string, string> = {
        "XSS_PROTECTION": "CWE-79",
        "CLICKJACKING": "CWE-1021",
        "TRANSPORT_SECURITY": "CWE-319",
        "SERVER_DISCLOSURE": "CWE-200",
        "MIME_SNIFFING": "CWE-16",
        "FRAMEWORK_EXPOSURE": "CWE-200",
        "REFERRER_POLICY": "CWE-200",
        "SECURITY_TXT": "CWE-1059",
        "ROBOTS_TXT": "CWE-538",
        "PERMISSIONS_POLICY": "CWE-16",
    };

    return {
        code: `[${cweMap[code] || "CWE-000"}] ${code}`,
        name: code,
        severity,
        description,
        points,
        maxPoints,
    };
}

function createErrorResult(slug: string, scanDuration: number): LightAuditResult {
    return {
        status: "error",
        slug,
        vulnerabilities: [{
            code: "[ERR-001] SCAN_TIMEOUT",
            name: "SCAN_TIMEOUT",
            severity: "info",
            description: "Target blocked the scanner or timed out.",
            points: 0,
            maxPoints: 0,
        }],
        scanDuration,
        siteType: "unknown",
        industryCategory: "unknown",
        totalScore: 0,
        maxScore: 100,
        scorePercentage: 0,
    };
}

function createPerfectResult(slug: string, scanDuration: number): LightAuditResult {
    const maxScore = 100;
    return {
        status: "clean",
        slug,
        vulnerabilities: [
            { code: "[CWE-79] XSS_PROTECTION", name: "XSS_PROTECTION", severity: "info", description: "Content-Security-Policy header present", points: 15, maxPoints: 15 },
            { code: "[CWE-1021] CLICKJACKING", name: "CLICKJACKING", severity: "info", description: "Frame embedding protection enabled", points: 15, maxPoints: 15 },
            { code: "[CWE-319] TRANSPORT_SECURITY", name: "TRANSPORT_SECURITY", severity: "info", description: "HSTS header enforces secure connections", points: 15, maxPoints: 15 },
            { code: "[CWE-16] MIME_SNIFFING", name: "MIME_SNIFFING", severity: "info", description: "X-Content-Type-Options: nosniff enabled", points: 10, maxPoints: 10 },
            { code: "[CWE-200] SERVER_DISCLOSURE", name: "SERVER_DISCLOSURE", severity: "info", description: "Server banner not disclosed", points: 5, maxPoints: 5 },
            { code: "[CWE-200] FRAMEWORK_EXPOSURE", name: "FRAMEWORK_EXPOSURE", severity: "info", description: "No framework fingerprint in headers", points: 5, maxPoints: 5 },
            { code: "[CWE-200] REFERRER_POLICY", name: "REFERRER_POLICY", severity: "info", description: "Referrer-Policy: strict-origin-when-cross-origin", points: 10, maxPoints: 10 },
            { code: "[CWE-16] PERMISSIONS_POLICY", name: "PERMISSIONS_POLICY", severity: "info", description: "Permissions-Policy header present", points: 10, maxPoints: 10 },
            { code: "[CWE-1059] SECURITY_TXT", name: "SECURITY_TXT", severity: "info", description: "security.txt file present", points: 10, maxPoints: 10 },
            { code: "[CWE-538] ROBOTS_TXT", name: "ROBOTS_TXT", severity: "info", description: "robots.txt present and clean", points: 5, maxPoints: 5 },
        ],
        scanDuration,
        siteType: "spa",
        industryCategory: "saas",
        totalScore: maxScore,
        maxScore,
        scorePercentage: 100,
    };
}

async function checkSecurityTxt(baseUrl: string): Promise<{ exists: boolean }> {
    try {
        const response = await fetch(`${baseUrl}/.well-known/security.txt`, {
            signal: AbortSignal.timeout(3000),
        });
        return { exists: response.ok };
    } catch {
        return { exists: false };
    }
}

async function checkRobotsTxt(baseUrl: string): Promise<{ exists: boolean; exposesSensitive: boolean }> {
    try {
        const response = await fetch(`${baseUrl}/robots.txt`, {
            signal: AbortSignal.timeout(3000),
        });
        if (!response.ok) return { exists: false, exposesSensitive: false };

        const content = await response.text();
        const sensitivePatterns = ["/admin", "/api", "/internal", "/backup", "/config", "/.env", "/private"];
        const exposesSensitive = sensitivePatterns.some(p => content.toLowerCase().includes(p));

        return { exists: true, exposesSensitive };
    } catch {
        return { exists: false, exposesSensitive: false };
    }
}

function detectSiteType(html: string): LightAuditResult["siteType"] {
    const htmlLower = html.toLowerCase();

    if (htmlLower.includes("__next") || htmlLower.includes("_nuxt") ||
        htmlLower.includes("ng-app") || htmlLower.includes("data-reactroot")) {
        return "spa";
    }

    const hasForm = htmlLower.includes("<form");
    const hasScript = htmlLower.includes("<script");
    if (!hasForm && !hasScript && html.length < 50000) {
        return "static";
    }

    return "dynamic";
}

function detectIndustry(url: string, html: string): LightAuditResult["industryCategory"] {
    const urlLower = url.toLowerCase();
    const htmlLower = html.toLowerCase();

    const fintechKeywords = ["payment", "bank", "finance", "invest", "crypto", "wallet", "stripe", "paypal"];
    if (fintechKeywords.some(k => urlLower.includes(k) || htmlLower.includes(k))) {
        return "fintech";
    }

    const ecomKeywords = ["shop", "cart", "checkout", "product", "store", "buy"];
    if (ecomKeywords.some(k => urlLower.includes(k) || htmlLower.includes(k))) {
        return "ecommerce";
    }

    const saasKeywords = ["dashboard", "login", "signup", "subscription", "pricing", "api"];
    if (saasKeywords.some(k => urlLower.includes(k) || htmlLower.includes(k))) {
        return "saas";
    }

    return "marketing";
}

function generateSlug(url: string): string {
    try {
        const hostname = new URL(url).hostname.replace("www.", "");
        const slug = hostname.replace(/[^a-z0-9]/gi, "-").toLowerCase();
        const timestamp = Date.now().toString(36);
        return `${slug}-${timestamp}`;
    } catch {
        return `audit-${Date.now()}`;
    }
}
