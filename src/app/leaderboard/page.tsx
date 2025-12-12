"use client";

import { useState } from "react";
import { IndustrialBadge } from "@/components/industrial-badge";
import { Zap, TrendingUp, AlertTriangle, Activity, Search, ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";

// ==================== MOCK DATA ====================
interface LeaderboardEntry {
    id: string;
    rank: number | null; // null for baseline references
    name: string;
    url: string;
    slug: string;
    classRank: 1 | 2 | 3 | 4 | 5;
    latency: number;
    score: number;
    change: "up" | "down" | "none";
    lastAudit: string;
    isBaseline?: boolean; // Industry reference, not ranked
}

// SECURE - Class 05, 04, 03 (passing thresholds)
const SECURE_BASELINES: LeaderboardEntry[] = [
    { id: "ref1", rank: null, name: "Class 05 Threshold", url: "95+ score", slug: "ref", classRank: 5, latency: 50, score: 95, change: "none", lastAudit: "", isBaseline: true },
    { id: "ref2", rank: null, name: "Class 04 Threshold", url: "85-94 score", slug: "ref", classRank: 4, latency: 150, score: 85, change: "none", lastAudit: "", isBaseline: true },
    { id: "ref3", rank: null, name: "Class 03 Threshold", url: "70-84 score", slug: "ref", classRank: 3, latency: 300, score: 70, change: "none", lastAudit: "", isBaseline: true },
];

// VULNERABLE - Class 02, 01 (failing thresholds)
const VULNERABLE_BASELINES: LeaderboardEntry[] = [
    { id: "ref4", rank: null, name: "Class 02 Threshold", url: "50-69 score", slug: "ref", classRank: 2, latency: 600, score: 50, change: "none", lastAudit: "", isBaseline: true },
    { id: "ref5", rank: null, name: "Class 01 Threshold", url: "0-49 score", slug: "ref", classRank: 1, latency: 1500, score: 25, change: "none", lastAudit: "", isBaseline: true },
];

// User-submitted audits (ranked) - Using fictional examples
const MOCK_DATA: LeaderboardEntry[] = [
    // CLASS 05 - Infrastructure (These would be real high-scoring sites)
    { id: "1", rank: 1, name: "[Your Site Here]", url: "your-startup.com", slug: "example-1", classRank: 5, latency: 67, score: 97, change: "up", lastAudit: "4h ago" },

    // CLASS 04 - Enterprise
    { id: "2", rank: 2, name: "[Redacted]", url: "████████.io", slug: "example-2", classRank: 4, latency: 156, score: 88, change: "none", lastAudit: "6h ago" },

    // CLASS 03 - Standard
    { id: "3", rank: 3, name: "[Redacted]", url: "████████.com", slug: "example-3", classRank: 3, latency: 234, score: 72, change: "none", lastAudit: "12h ago" },

    // CLASS 02 - Provisional (Anonymous to protect the founder)
    { id: "4", rank: 4, name: "[Anonymous]", url: "███-███.dev", slug: "example-4", classRank: 2, latency: 445, score: 48, change: "down", lastAudit: "18h ago" },

    // CLASS 01 - Critical (Anonymous - we don't shame)
    { id: "5", rank: 5, name: "[Anonymous]", url: "████.xyz", slug: "example-5", classRank: 1, latency: 1234, score: 21, change: "down", lastAudit: "2d ago" },
];

// Ticker items for marquee - only show positive examples
const TICKER_ITEMS = [
    { name: "GOOGLE.COM", class: 5, type: "win" },
    { name: "STRIPE.COM", class: 5, type: "win" },
    { name: "CLOUDFLARE", class: 5, type: "win" },
    { name: "GITHUB.COM", class: 5, type: "win" },
    { name: "VERCEL.COM", class: 5, type: "win" },
];

// ==================== COMPONENTS ====================

function StatusBar() {
    return (
        <div className="sticky top-0 z-50 border-b border-gray-800 bg-black/95 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
                <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="font-mono text-xs text-gray-400 tracking-widest uppercase">
                        <span className="text-white font-bold">ALTCAST</span> SECURITY INDEX
                        <span className="text-red-400 ml-2">// LIVE</span>
                    </span>
                </a>
                <div className="flex items-center gap-4 font-mono text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                        <Activity className="w-3 h-3" />
                        <span>SYSTEM LOAD: <span className="text-emerald-400">98%</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                        <span>QUEUE: <span className="text-yellow-400">48H</span></span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function TickerTape() {
    const duplicatedItems = [...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS];

    return (
        <div className="border-b border-gray-800 bg-gray-950 overflow-hidden">
            <div className="animate-marquee flex whitespace-nowrap py-2">
                {duplicatedItems.map((item, i) => (
                    <div key={i} className="flex items-center mx-6">
                        <span className={`font-mono text-xs tracking-widest uppercase ${item.type === "win" ? "text-emerald-400" : "text-red-400"
                            }`}>
                            {item.name}
                        </span>
                        <span className={`ml-2 font-mono text-[10px] px-1.5 py-0.5 border ${item.class === 5 ? "border-amber-400/50 text-amber-400" :
                            item.class === 4 ? "border-blue-400/50 text-blue-400" :
                                item.class === 3 ? "border-emerald-400/50 text-emerald-400" :
                                    item.class === 2 ? "border-yellow-400/50 text-yellow-400" :
                                        "border-red-500/50 text-red-500"
                            }`}>
                            CLASS {String(item.class).padStart(2, "0")}
                        </span>
                    </div>
                ))}
            </div>

            <style jsx>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-33.333%); }
                }
                .animate-marquee {
                    animation: marquee 20s linear infinite;
                }
            `}</style>
        </div>
    );
}

function SearchBar() {
    const [query, setQuery] = useState("");

    return (
        <div className="border-b border-gray-800 bg-black">
            <div className="max-w-7xl mx-auto px-4 py-4">
                <div className="flex items-center gap-4">
                    <div className="flex-1 flex items-center gap-2 border border-gray-800 bg-gray-950 px-4 py-2">
                        <Search className="w-4 h-4 text-gray-600" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search targets..."
                            className="bg-transparent font-mono text-sm text-white placeholder-gray-600 focus:outline-none w-full"
                        />
                    </div>
                    <div className="flex items-center gap-2 font-mono text-xs text-gray-500">
                        <span>SORTED BY:</span>
                        <button className="px-2 py-1 border border-gray-700 text-white bg-gray-900">RANK</button>
                        <button className="px-2 py-1 border border-gray-800 hover:border-gray-700 transition-colors">LATENCY</button>
                        <button className="px-2 py-1 border border-gray-800 hover:border-gray-700 transition-colors">SCORE</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function getLatencyColor(latency: number): string {
    if (latency < 150) return "text-emerald-400";
    if (latency < 500) return "text-yellow-400";
    return "text-red-400";
}

function DataGrid({ data, isBaseline = false, sectionType }: { data: LeaderboardEntry[]; isBaseline?: boolean; sectionType?: "secure" | "vulnerable" }) {
    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            {/* Section Header for SECURE Baselines */}
            {isBaseline && sectionType === "secure" && (
                <div className="flex items-center gap-4 mb-4">
                    <div className="bg-emerald-400/20 text-emerald-400 border border-emerald-400/50 px-3 py-1 font-mono text-xs uppercase tracking-wider">
                        Secure Classes
                    </div>
                    <span className="font-mono text-xs text-gray-500">Class 05, 04, 03 meet security standards</span>
                </div>
            )}

            {/* Section Header for VULNERABLE Baselines */}
            {isBaseline && sectionType === "vulnerable" && (
                <div className="flex items-center gap-4 mb-4">
                    <div className="bg-red-400/20 text-red-400 border border-red-400/50 px-3 py-1 font-mono text-xs uppercase tracking-wider">
                        Vulnerable Classes
                    </div>
                    <span className="font-mono text-xs text-gray-500">Class 02, 01 require immediate attention</span>
                </div>
            )}

            {/* Section Header for Live Rankings */}
            {!isBaseline && (
                <div className="flex items-center gap-4 mb-4">
                    <div className="bg-amber-400/20 text-amber-400 border border-amber-400/50 px-3 py-1 font-mono text-xs uppercase tracking-wider">
                        Live Rankings
                    </div>
                    <span className="font-mono text-xs text-gray-500">User-submitted security audits</span>
                </div>
            )}

            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-gray-800 font-mono text-[10px] text-gray-500 uppercase tracking-widest bg-black">
                <div className="col-span-1">{isBaseline ? "REF" : "RANK"}</div>
                <div className="col-span-4">TARGET</div>
                <div className="col-span-2 text-center">DESIGNATION</div>
                <div className="col-span-1 text-right">LATENCY</div>
                <div className="col-span-2 text-center">SCORE</div>
                <div className="col-span-2 text-right">ACTION</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-900">
                {data.map((entry) => (
                    <div
                        key={entry.id}
                        className={`grid grid-cols-12 gap-4 px-4 py-4 items-center hover:bg-gray-950/50 transition-colors ${entry.isBaseline ? "bg-amber-950/5 border-l-2 border-amber-400/30" : entry.rank === 1 ? "bg-yellow-950/10 border-l-2 border-amber-400" : ""
                            }`}
                    >
                        {/* Rank */}
                        <div className="col-span-1 font-mono text-2xl font-bold text-gray-600">
                            {entry.isBaseline ? (
                                <span className="text-amber-400/60 text-sm">REF</span>
                            ) : (
                                String(entry.rank).padStart(2, "0")
                            )}
                        </div>

                        {/* Target */}
                        <div className="col-span-4">
                            <div className="flex items-center gap-3">
                                <div>
                                    <div className="font-bold text-white flex items-center gap-2">
                                        {entry.name}
                                        {!entry.isBaseline && entry.change === "up" && <TrendingUp className="w-3 h-3 text-emerald-400" />}
                                        {!entry.isBaseline && entry.change === "down" && <TrendingUp className="w-3 h-3 text-red-400 rotate-180" />}
                                        {entry.isBaseline && <span className="text-amber-400/60 text-[10px] font-mono">BASELINE</span>}
                                    </div>
                                    <div className="font-mono text-xs text-gray-500">{entry.url}</div>
                                </div>
                            </div>
                        </div>

                        {/* Designation */}
                        <div className="col-span-2 flex justify-center">
                            <IndustrialBadge rank={entry.classRank} />
                        </div>

                        {/* Latency */}
                        <div className={`col-span-1 text-right font-mono text-sm font-bold ${getLatencyColor(entry.latency)}`}>
                            {entry.latency}ms
                        </div>

                        {/* Score */}
                        <div className="col-span-2 flex items-center justify-center gap-2">
                            <div className="w-24 h-1.5 bg-gray-900 border border-gray-800 overflow-hidden">
                                <div
                                    className={`h-full ${entry.score >= 80 ? "bg-emerald-500" :
                                        entry.score >= 50 ? "bg-yellow-500" :
                                            "bg-red-500"
                                        }`}
                                    style={{ width: `${entry.score}%` }}
                                />
                            </div>
                            <span className="font-mono text-xs text-gray-400">{entry.score}</span>
                        </div>

                        {/* Action */}
                        <div className="col-span-2 flex justify-end">
                            {entry.isBaseline ? (
                                <span className="font-mono text-xs text-gray-600">REFERENCE ONLY</span>
                            ) : (
                                <Link
                                    href={`/audit/${entry.slug}`}
                                    className="flex items-center gap-2 px-3 py-1.5 border border-gray-800 hover:border-gray-600 hover:bg-gray-900 transition-colors font-mono text-xs text-gray-400 hover:text-white"
                                >
                                    <span>VIEW</span>
                                    <ArrowRight className="w-3 h-3" />
                                </Link>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function StatsBar() {
    return (
        <div className="border-b border-gray-800 bg-gray-950">
            <div className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-4 gap-8">
                <div className="text-center">
                    <div className="font-mono text-2xl font-bold text-white">1,247</div>
                    <div className="font-mono text-[10px] text-gray-500 tracking-widest">TOTAL AUDITS</div>
                </div>
                <div className="text-center">
                    <div className="font-mono text-2xl font-bold text-emerald-400">312</div>
                    <div className="font-mono text-[10px] text-gray-500 tracking-widest">CLASS 05</div>
                </div>
                <div className="text-center">
                    <div className="font-mono text-2xl font-bold text-red-400">89</div>
                    <div className="font-mono text-[10px] text-gray-500 tracking-widest">CLASS 01</div>
                </div>
                <div className="text-center">
                    <div className="font-mono text-2xl font-bold text-yellow-400">48h</div>
                    <div className="font-mono text-[10px] text-gray-500 tracking-widest">AVG QUEUE</div>
                </div>
            </div>
        </div>
    );
}

// ==================== MAIN PAGE ====================
export default function LeaderboardPage() {
    return (
        <div className="min-h-screen bg-black text-white cursor-auto">
            <StatusBar />
            <TickerTape />
            <StatsBar />
            <SearchBar />

            {/* SECURE Baselines (Class 03+) */}
            <DataGrid data={SECURE_BASELINES} isBaseline={true} sectionType="secure" />

            {/* VULNERABLE Baselines (Class 02-) */}
            <DataGrid data={VULNERABLE_BASELINES} isBaseline={true} sectionType="vulnerable" />

            {/* Separator */}
            <div className="max-w-7xl mx-auto px-4">
                <div className="border-t border-gray-800" />
            </div>

            {/* Live Rankings */}
            <DataGrid data={MOCK_DATA} isBaseline={false} />

            {/* Footer */}
            <div className="border-t border-gray-800 bg-gray-950">
                <div className="max-w-7xl mx-auto px-4 py-6 text-center font-mono text-xs text-gray-600">
                    <p>ALTCAST SECURITY INDEX © 2025 // UPDATED EVERY 15 MINUTES</p>
                    <p className="mt-1 text-gray-700">Rankings based on automated security audits. Not investment advice.</p>
                </div>
            </div>
        </div>
    );
}

