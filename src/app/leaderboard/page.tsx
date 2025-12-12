"use client";

import { useState } from "react";
import { IndustrialBadge } from "@/components/industrial-badge";
import { Zap, TrendingUp, AlertTriangle, Activity, Search, ArrowRight, ExternalLink, Shield } from "lucide-react";
import Link from "next/link";

// ==================== DATA TYPES ====================
// TODO: Replace with Supabase types when integrating
// import { Database } from "@/types/supabase";
// type LeaderboardEntry = Database["public"]["Tables"]["audits"]["Row"];

interface LeaderboardEntry {
    id: string;
    rank: number;
    name: string;
    url: string;
    slug: string;
    classRank: 1 | 2 | 3 | 4 | 5;
    latency: number;
    score: number;
    change: "up" | "down" | "none";
    lastAudit: string;
}

interface BaselineReference {
    id: string;
    name: string;
    url: string;
    classRank: 5;
    score: number;
    description: string;
}

// ==================== BASELINE REFERENCES ====================
// Industry giants used as security benchmarks - NOT competing in rankings
const BASELINE_REFERENCES: BaselineReference[] = [
    { id: "ref-1", name: "Stripe", url: "dashboard.stripe.com", classRank: 5, score: 98, description: "Payment infrastructure gold standard" },
    { id: "ref-2", name: "Linear", url: "linear.app", classRank: 5, score: 97, description: "Engineering-grade issue tracking" },
    { id: "ref-3", name: "Vercel", url: "vercel.com", classRank: 5, score: 96, description: "Edge deployment reference" },
    { id: "ref-4", name: "Cloudflare", url: "dash.cloudflare.com", classRank: 5, score: 99, description: "Security infrastructure baseline" },
];

// ==================== RANKED ENTRIES ====================
// TODO: Fetch from Supabase: supabase.from('audits').select('*').order('score', { ascending: false })
const RANKED_ENTRIES: LeaderboardEntry[] = [
    // CLASS 04 - Enterprise
    { id: "4", rank: 1, name: "Notion", url: "notion.so", slug: "notion-so", classRank: 4, latency: 156, score: 91, change: "down", lastAudit: "6h ago" },
    { id: "5", rank: 2, name: "Figma", url: "figma.com", slug: "figma-com", classRank: 4, latency: 134, score: 89, change: "up", lastAudit: "3h ago" },

    // CLASS 03 - Standard
    { id: "6", rank: 3, name: "Raycast", url: "raycast.com", slug: "raycast-com", classRank: 3, latency: 234, score: 82, change: "none", lastAudit: "12h ago" },
    { id: "7", rank: 4, name: "Cal.com", url: "cal.com", slug: "cal-com", classRank: 3, latency: 189, score: 79, change: "up", lastAudit: "8h ago" },
    { id: "8", rank: 5, name: "Dub.co", url: "dub.co", slug: "dub-co", classRank: 3, latency: 312, score: 75, change: "down", lastAudit: "5h ago" },

    // CLASS 02 - Provisional
    { id: "9", rank: 6, name: "MapleAI", url: "maple-ai.io", slug: "maple-ai", classRank: 2, latency: 567, score: 58, change: "down", lastAudit: "24h ago" },
    { id: "10", rank: 7, name: "ShipFast", url: "shipfast.dev", slug: "shipfast-dev", classRank: 2, latency: 445, score: 52, change: "none", lastAudit: "18h ago" },

    // CLASS 01 - Critical (Vibecoders)
    { id: "11", rank: 8, name: "FastGen AI", url: "fastgen-ai.com", slug: "fastgen-ai", classRank: 1, latency: 1234, score: 23, change: "down", lastAudit: "2d ago" },
    { id: "12", rank: 9, name: "TalkPDF", url: "talkpdf.io", slug: "talkpdf-io", classRank: 1, latency: 2341, score: 18, change: "down", lastAudit: "3d ago" },
    { id: "13", rank: 10, name: "VibeCode", url: "vibecode.xyz", slug: "vibecode-xyz", classRank: 1, latency: 3456, score: 12, change: "down", lastAudit: "5d ago" },
];

// Ticker items for marquee - mix of baselines and audited targets
const TICKER_ITEMS = [
    { name: "NOTION", class: 4, type: "win" },
    { name: "TALKPDF", class: 1, type: "fail" },
    { name: "FIGMA", class: 4, type: "win" },
    { name: "VIBECODE", class: 1, type: "fail" },
    { name: "RAYCAST", class: 3, type: "win" },
    { name: "FASTGEN", class: 1, type: "fail" },
    { name: "CAL.COM", class: 3, type: "win" },
    { name: "SHIPFAST", class: 2, type: "fail" },
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

function DataGrid({ data }: { data: LeaderboardEntry[] }) {
    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-gray-800 font-mono text-[10px] text-gray-500 uppercase tracking-widest sticky top-[41px] bg-black z-40">
                <div className="col-span-1">RANK</div>
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
                        className={`grid grid-cols-12 gap-4 px-4 py-4 items-center hover:bg-gray-950/50 transition-colors ${entry.rank === 1 ? "bg-yellow-950/10 border-l-2 border-amber-400" : ""
                            }`}
                    >
                        {/* Rank */}
                        <div className="col-span-1 font-mono text-2xl font-bold text-gray-600">
                            {String(entry.rank).padStart(2, "0")}
                        </div>

                        {/* Target */}
                        <div className="col-span-4">
                            <div className="flex items-center gap-3">
                                <div>
                                    <div className="font-bold text-white flex items-center gap-2">
                                        {entry.name}
                                        {entry.change === "up" && <TrendingUp className="w-3 h-3 text-emerald-400" />}
                                        {entry.change === "down" && <TrendingUp className="w-3 h-3 text-red-400 rotate-180" />}
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
                            <Link
                                href={`/audit/${entry.slug}`}
                                className="flex items-center gap-2 px-3 py-1.5 border border-gray-800 hover:border-gray-600 hover:bg-gray-900 transition-colors font-mono text-xs text-gray-400 hover:text-white"
                            >
                                <span>VIEW</span>
                                <ArrowRight className="w-3 h-3" />
                            </Link>
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

            {/* Baseline References Section */}
            <div className="border-b border-gray-800 bg-gray-950/50">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Shield className="w-4 h-4 text-amber-400" />
                        <h2 className="font-mono text-xs text-gray-400 uppercase tracking-widest">
                            Industry Baselines <span className="text-amber-400">// CLASS 05 REFERENCE</span>
                        </h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {BASELINE_REFERENCES.map((ref) => (
                            <div
                                key={ref.id}
                                className="border border-amber-400/20 bg-amber-400/5 px-4 py-3 hover:border-amber-400/40 transition-colors"
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-bold text-amber-400">{ref.name}</span>
                                    <span className="font-mono text-xs text-amber-400/70">{ref.score}</span>
                                </div>
                                <div className="font-mono text-[10px] text-gray-500">{ref.url}</div>
                                <div className="font-mono text-[10px] text-gray-600 mt-1">{ref.description}</div>
                            </div>
                        ))}
                    </div>
                    <p className="text-center font-mono text-[10px] text-gray-600 mt-4">
                        These industry leaders serve as security benchmarks — not competing in rankings
                    </p>
                </div>
            </div>

            <SearchBar />
            <DataGrid data={RANKED_ENTRIES} />

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
