"use client";

import { useState } from "react";
import {
    ShieldCheck,
    AlertTriangle,
    Zap,
    Lock,
    CheckCircle,
    XCircle,
    Info,
    Clock,
    Activity,
    Target,
    FileWarning,
    Mail,
} from "lucide-react";

// ==================== DATA TYPES ====================
type Grade = "S" | "A+" | "A" | "B+" | "B" | "C+" | "C" | "F";
type FindingStatus = "PASS" | "FAIL" | "INFO";
type Severity = "critical" | "high" | "medium" | "low" | "info";

interface Finding {
    id: string;
    code: string;
    name: string;
    severity: Severity;
    status: FindingStatus;
    description: string;
}

interface AuditReport {
    target: string;
    domain: string;
    grade: Grade;
    score: number;
    latency: number;
    uptime: number;
    threatLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    findings: Finding[];
    screenshot: string;
    completedAt: string;
}

// ==================== MOCK DATA ====================
const MOCK_REPORT: AuditReport = {
    target: "https://crypto-startup-x.com",
    domain: "crypto-startup-x.com",
    grade: "B+",
    score: 72,
    latency: 234,
    uptime: 99.2,
    threatLevel: "MEDIUM",
    completedAt: new Date().toISOString(),
    screenshot: "/api/placeholder/800/600",
    findings: [
        {
            id: "1",
            code: "CWE-79",
            name: "Cross-Site Scripting (XSS)",
            severity: "high",
            status: "FAIL",
            description: "Reflected XSS vulnerability found in search parameter",
        },
        {
            id: "2",
            code: "CWE-89",
            name: "SQL Injection",
            severity: "critical",
            status: "PASS",
            description: "No SQL injection vulnerabilities detected",
        },
        {
            id: "3",
            code: "CWE-352",
            name: "CSRF Protection",
            severity: "high",
            status: "PASS",
            description: "CSRF tokens properly implemented",
        },
        {
            id: "4",
            code: "CWE-693",
            name: "Security Headers",
            severity: "medium",
            status: "INFO",
            description: "X-Frame-Options header is set to SAMEORIGIN instead of DENY",
        },
        {
            id: "5",
            code: "CWE-311",
            name: "Encryption in Transit",
            severity: "critical",
            status: "PASS",
            description: "TLS 1.3 with strong cipher suites",
        },
        {
            id: "6",
            code: "CWE-200",
            name: "Information Exposure",
            severity: "medium",
            status: "FAIL",
            description: "Server version disclosed in HTTP headers",
        },
        {
            id: "7",
            code: "CWE-16",
            name: "Cookie Security",
            severity: "medium",
            status: "PASS",
            description: "HttpOnly and Secure flags set on sensitive cookies",
        },
        {
            id: "8",
            code: "CWE-942",
            name: "CORS Configuration",
            severity: "high",
            status: "INFO",
            description: "Permissive CORS policy detected - review recommended",
        },
    ],
};

// ==================== UTILITY FUNCTIONS ====================
function getGradeConfig(grade: Grade) {
    const configs = {
        S: {
            label: "CLASS 05 | INFRASTRUCTURE",
            color: "text-amber-400",
            barColor: "bg-amber-400",
            bgColor: "bg-amber-400/10",
            borderColor: "border-amber-400",
            glowClass: "shadow-[0_0_60px_rgba(251,191,36,0.4)]",
            holoEffect: true,
        },
        "A+": {
            label: "CLASS 05 | INFRASTRUCTURE",
            color: "text-red-400",
            barColor: "bg-red-400",
            bgColor: "bg-red-400/10",
            borderColor: "border-red-400",
            glowClass: "shadow-[0_0_40px_rgba(248,113,113,0.3)]",
            holoEffect: false,
        },
        A: {
            label: "CLASS 04 | ENTERPRISE",
            color: "text-emerald-400",
            barColor: "bg-emerald-400",
            bgColor: "bg-emerald-400/10",
            borderColor: "border-emerald-400",
            glowClass: "shadow-[0_0_30px_rgba(52,211,153,0.3)]",
            holoEffect: false,
        },
        "B+": {
            label: "CLASS 04 | ENTERPRISE",
            color: "text-blue-400",
            barColor: "bg-blue-400",
            bgColor: "bg-blue-400/10",
            borderColor: "border-blue-400",
            glowClass: "",
            holoEffect: false,
        },
        B: {
            label: "CLASS 03 | STANDARD",
            color: "text-blue-400",
            barColor: "bg-blue-400",
            bgColor: "bg-blue-400/10",
            borderColor: "border-blue-400",
            glowClass: "",
            holoEffect: false,
        },
        "C+": {
            label: "CLASS 02 | PROVISIONAL",
            color: "text-yellow-400",
            barColor: "bg-yellow-400",
            bgColor: "bg-yellow-400/10",
            borderColor: "border-yellow-400",
            glowClass: "",
            holoEffect: false,
        },
        C: {
            label: "CLASS 02 | PROVISIONAL",
            color: "text-orange-400",
            barColor: "bg-orange-400",
            bgColor: "bg-orange-400/10",
            borderColor: "border-orange-400",
            glowClass: "",
            holoEffect: false,
        },
        F: {
            label: "CLASS 01 | CRITICAL",
            color: "text-red-500",
            barColor: "bg-red-500",
            bgColor: "bg-red-500/10",
            borderColor: "border-red-500",
            glowClass: "shadow-[0_0_40px_rgba(239,68,68,0.5)]",
            holoEffect: false,
            glitchEffect: true,
        },
    };
    return configs[grade];
}

function getStatusBadge(grade: Grade) {
    if (["S", "A+", "A"].includes(grade)) {
        return {
            icon: ShieldCheck,
            text: "VERIFIED SECURE",
            bgColor: "bg-emerald-500/20",
            textColor: "text-emerald-400",
            borderColor: "border-emerald-500/50",
        };
    } else if (["B+", "B", "C+", "C"].includes(grade)) {
        return {
            icon: AlertTriangle,
            text: "SECURITY HARDENING REQUIRED",
            bgColor: "bg-yellow-500/20",
            textColor: "text-yellow-400",
            borderColor: "border-yellow-500/50",
        };
    } else {
        return {
            icon: XCircle,
            text: "CONSUMER WARNING: ACTIVE RISK",
            bgColor: "bg-red-500/20",
            textColor: "text-red-400",
            borderColor: "border-red-500/50",
        };
    }
}

// ==================== COMPONENTS ====================

function HeaderBar() {
    return (
        <div className="border-b border-gray-800 bg-black/80 backdrop-blur-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
                <a href="/" className="font-mono text-xs sm:text-sm tracking-[0.2em] text-gray-400 uppercase hover:text-white transition-colors">
                    <span className="text-white font-bold">ALTCAST</span> SECURITY INDEX{" "}
                    <span className="hidden sm:inline text-gray-600">//</span>{" "}
                    <span className="hidden sm:inline text-red-400">PUBLIC RECORD</span>
                </a>
                <div className="flex items-center gap-4">
                    <a href="/leaderboard" className="font-mono text-xs text-gray-500 hover:text-white transition-colors">
                        LEADERBOARD
                    </a>
                    <div className="flex items-center gap-2 text-gray-500 font-mono text-xs">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="hidden sm:inline">LIVE</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ grade }: { grade: Grade }) {
    const status = getStatusBadge(grade);
    const Icon = status.icon;

    return (
        <div
            className={`inline-flex items-center gap-2 px-4 py-2 border ${status.borderColor} ${status.bgColor} ${status.textColor} font-mono text-sm font-bold tracking-wider`}
        >
            <Icon size={18} />
            {status.text}
        </div>
    );
}

function GradeDisplay({ grade, score }: { grade: Grade; score: number }) {
    const config = getGradeConfig(grade);

    return (
        <div className="relative">
            {/* Holo effect for S-tier */}
            {config.holoEffect && (
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 via-transparent to-amber-600/20 animate-pulse rounded-lg" />
            )}

            <div
                className={`relative border-2 ${config.borderColor} ${config.bgColor} ${config.glowClass} p-6 sm:p-8 text-center`}
            >
                {/* Grade Letter */}
                <div
                    className={`text-8xl sm:text-9xl font-black ${config.color} relative ${grade === "F" ? "animate-pulse" : ""
                        }`}
                    style={{
                        textShadow:
                            grade === "F"
                                ? "2px 0 #ff0000, -2px 0 #00ff00"
                                : grade === "S"
                                    ? "0 0 30px rgba(251,191,36,0.8)"
                                    : "none",
                    }}
                >
                    {grade}
                </div>

                {/* Label */}
                <div
                    className={`font-mono text-sm tracking-[0.3em] uppercase mt-2 ${config.color}`}
                >
                    {config.label}
                </div>

                {/* Score Bar */}
                <div className="mt-6">
                    <div className="flex justify-between text-xs font-mono text-gray-500 mb-1">
                        <span>SECURITY SCORE</span>
                        <span>{score}/100</span>
                    </div>
                    <div className="h-2 bg-gray-900 border border-gray-700 overflow-hidden">
                        <div
                            className={`h-full ${config.barColor} transition-all duration-1000`}
                            style={{ width: `${score}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatsGrid({
    latency,
    uptime,
    threatLevel,
}: {
    latency: number;
    uptime: number;
    threatLevel: string;
}) {
    const stats = [
        {
            icon: Zap,
            label: "RESPONSE LATENCY",
            value: `${latency}ms`,
            color:
                latency < 200
                    ? "text-emerald-400"
                    : latency < 500
                        ? "text-yellow-400"
                        : "text-red-400",
        },
        {
            icon: Activity,
            label: "UPTIME (30D)",
            value: `${uptime}%`,
            color:
                uptime >= 99.9
                    ? "text-emerald-400"
                    : uptime >= 99
                        ? "text-yellow-400"
                        : "text-red-400",
        },
        {
            icon: Target,
            label: "THREAT LEVEL",
            value: threatLevel,
            color:
                threatLevel === "LOW"
                    ? "text-emerald-400"
                    : threatLevel === "MEDIUM"
                        ? "text-yellow-400"
                        : "text-red-400",
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-4">
            {stats.map((stat, i) => (
                <div
                    key={i}
                    className="border border-gray-800 bg-black/50 p-4 flex items-center gap-4"
                >
                    <stat.icon className="text-gray-600" size={24} />
                    <div>
                        <div className="font-mono text-[10px] text-gray-500 tracking-wider">
                            {stat.label}
                        </div>
                        <div className={`font-mono text-xl font-bold ${stat.color}`}>
                            {stat.value}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function DiagnosticLedger({ findings }: { findings: Finding[] }) {
    // Sort: critical first, then warning, then info
    const sortedFindings = [...findings].sort((a, b) => {
        const severityOrder = { critical: 0, high: 1, medium: 2, low: 3, info: 4 };
        return (severityOrder[a.severity] || 4) - (severityOrder[b.severity] || 4);
    });

    const passCount = findings.filter(f => f.severity === "info" || f.status === "PASS").length;

    return (
        <div className="border border-gray-800 bg-black/30">
            {/* Header */}
            <div className="border-b border-gray-800 px-4 sm:px-6 py-4 flex items-center justify-between bg-gray-900/50">
                <div className="flex items-center gap-2">
                    <FileWarning className="text-gray-500" size={18} />
                    <span className="font-mono text-sm font-bold text-white tracking-wider">
                        DIAGNOSTIC LEDGER
                    </span>
                </div>
                <div className="font-mono text-xs text-gray-500">
                    {passCount}/{findings.length} PASSED
                </div>
            </div>

            {/* Findings List */}
            <div className="divide-y divide-gray-800">
                {sortedFindings.map((finding) => {
                    // Determine colors based on severity
                    const isSecure = finding.severity === "info" || finding.severity === "low" || finding.status === "PASS";
                    const isWarning = finding.severity === "medium";
                    const isCritical = finding.severity === "critical" || finding.severity === "high";

                    return (
                        <div
                            key={finding.id}
                            className={`px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 transition-colors ${isSecure ? "opacity-60 hover:opacity-100" : ""
                                } ${isCritical ? "bg-red-950/10" : ""}`}
                        >
                            {/* Status Icon */}
                            <div className="flex-shrink-0">
                                {isSecure ? (
                                    <CheckCircle className="text-emerald-500" size={20} />
                                ) : isWarning ? (
                                    <AlertTriangle className="text-yellow-400" size={20} />
                                ) : (
                                    <XCircle className="text-red-500" size={20} />
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-grow min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                    <span className={`font-mono text-xs ${isCritical ? "text-red-400" : "text-gray-500"}`}>
                                        {finding.code}
                                    </span>
                                    <span className="font-bold text-white text-sm truncate">
                                        {finding.name}
                                    </span>
                                </div>
                                <p className="text-gray-500 text-xs line-clamp-2">
                                    {finding.description}
                                </p>
                            </div>

                            {/* Badge */}
                            <div className="flex-shrink-0">
                                {isSecure ? (
                                    <span className="font-mono text-[10px] px-2 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                        SECURE
                                    </span>
                                ) : isWarning ? (
                                    <span className="font-mono text-[10px] px-2 py-1 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                                        WARNING
                                    </span>
                                ) : (
                                    <span className="font-mono text-[10px] px-2 py-1 bg-red-500/20 text-red-400 border border-red-500/30 font-bold animate-pulse">
                                        CRITICAL
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function BountyUpsell() {
    return (
        <div className="border border-gray-800 bg-gray-950 p-8 sm:p-12">
            <div className="max-w-2xl mx-auto text-center">
                {/* Warning Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-sm mb-8">
                    <AlertTriangle size={16} />
                    <span>THIS SCAN ONLY SCRATCHED THE SURFACE</span>
                </div>

                <h3 className="text-3xl sm:text-4xl font-black uppercase text-white mb-4">
                    This Is What We Found In 30 Seconds.
                    <span className="block text-red-400">Imagine What We&apos;d Find In 30 Minutes.</span>
                </h3>

                <p className="text-gray-400 font-mono text-sm mb-8 max-w-xl mx-auto">
                    This free scan detected surface-level vulnerabilities. The real threats hide deeper: race conditions, idempotency failures, payment exploits. Things that cost you money while you sleep.
                </p>

                {/* Pricing Card */}
                <div className="bg-black border border-gray-700 p-8 max-w-md mx-auto shadow-[4px_4px_0px_0px_#333] hover:translate-y-[-5px] transition-transform">
                    <div className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-2">One-Time Hostile Audit</div>
                    <h4 className="text-2xl font-black uppercase text-white mb-2">The Bounty</h4>
                    <div className="text-5xl font-black text-white mb-6">$299</div>

                    <ul className="space-y-3 font-mono text-sm text-left mb-8 text-gray-400">
                        <li className="flex gap-3 items-start">
                            <AlertTriangle className="text-[#CCFF00] mt-0.5 shrink-0" size={18} />
                            <span>Survival Probability: <span className="text-red-400 font-bold">&lt;5%</span>. Badge is scarce.</span>
                        </li>
                        <li className="flex gap-3 items-start">
                            <CheckCircle className="text-[#CCFF00] mt-0.5 shrink-0" size={18} />
                            <span>Full attack surface analysis + video evidence</span>
                        </li>
                        <li className="flex gap-3 items-start">
                            <CheckCircle className="text-[#CCFF00] mt-0.5 shrink-0" size={18} />
                            <span>If we break it: Fix prompts to patch every hole</span>
                        </li>
                        <li className="flex gap-3 items-start">
                            <ShieldCheck className="text-[#CCFF00] mt-0.5 shrink-0" size={18} />
                            <span>If you survive: Public "VERIFIED SECURE" badge</span>
                        </li>
                    </ul>

                    <a
                        href="/#pricing"
                        className="block w-full bg-white text-black py-4 font-black uppercase tracking-wider hover:bg-[#CCFF00] transition-colors text-center"
                    >
                        Deploy Hunter-Killer
                    </a>
                </div>

                <p className="text-gray-600 text-xs font-mono mt-6">
                    "We try to break your app before someone else does."
                </p>
            </div>
        </div>
    );
}

// ==================== MAIN PAGE COMPONENT ====================
export function SecurityReportPage({ report = MOCK_REPORT }: { report?: AuditReport }) {
    return (
        <div className="min-h-screen bg-black text-white cursor-auto">
            {/* Header */}
            <HeaderBar />

            {/* Status Badge */}
            <div className="border-b border-gray-800 bg-gray-950">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
                    <StatusBadge grade={report.grade} />
                </div>
            </div>

            {/* Hero Section */}
            <section className="border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
                    {/* Target Info */}
                    <div className="mb-8">
                        <div className="font-mono text-xs text-gray-500 mb-2 flex items-center gap-2">
                            <Clock size={12} />
                            {new Date(report.completedAt).toLocaleString()} UTC
                        </div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight">
                            {report.domain}
                        </h1>
                        <p className="font-mono text-sm text-gray-500 mt-1">{report.target}</p>
                    </div>

                    {/* Grade + Stats Grid */}
                    <div className="grid lg:grid-cols-2 gap-8">
                        <GradeDisplay grade={report.grade} score={report.score} />
                        <StatsGrid
                            latency={report.latency}
                            uptime={report.uptime}
                            threatLevel={report.threatLevel}
                        />
                    </div>
                </div>
            </section>

            {/* Diagnostic Ledger */}
            <section className="border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
                    <h2 className="text-xl font-bold uppercase tracking-wider mb-2 flex items-center gap-3">
                        <span className="w-1 h-6 bg-red-500" />
                        Surface-Level Scan Results
                    </h2>
                    <p className="text-gray-500 font-mono text-xs mb-6 ml-4">
                        FREE RECONNAISSANCE // Deeper threats require a full hostile audit
                    </p>
                    <DiagnosticLedger findings={report.findings} />
                </div>
            </section>

            {/* Upsell Section */}
            <section>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
                    <h2 className="text-xl font-bold uppercase tracking-wider mb-6 flex items-center gap-3">
                        <span className="w-1 h-6 bg-[#CCFF00]" />
                        Want The Full Picture?
                    </h2>
                    <BountyUpsell />
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-gray-800 bg-gray-950">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="font-mono text-xs text-gray-600">
                        © 2025 ALTCAST BUREAU OF STANDARDS. ALL RIGHTS RESERVED.
                    </div>
                    <div className="font-mono text-xs text-gray-600">
                        REPORT ID: {Math.random().toString(36).substring(2, 10).toUpperCase()}
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default SecurityReportPage;
