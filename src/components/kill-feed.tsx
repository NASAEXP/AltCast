"use client";

import { motion } from "motion/react";

const KILLS = [
    "Fintech App (Race Condition)",
    "Health SaaS (PII Leak)",
    "Crypto Wallet (Auth Bypass)",
    "E-Com (SQL Injection)",
    "HR Platform (XSS)",
    "Legal Tech (IDOR)",
    "Neobank (Double Spend)",
    "Logistics API (Broken Auth)",
    "Social Network (Data Scraping)"
];

export function KillFeed() {
    return (
        <div className="bg-danger border-b border-black py-3 overflow-hidden relative z-20 -rotate-1 scale-105 origin-right shadow-lg transform-gpu select-none pointer-events-none">
            <div className="flex">
                <MarqueeGroup />
                <MarqueeGroup />
            </div>
        </div>
    );
}

function MarqueeGroup() {
    return (
        <motion.div
            initial={{ x: 0 }}
            animate={{ x: "-100%" }}
            transition={{ duration: 40, ease: "linear", repeat: Infinity }}
            className="flex gap-12 font-black text-2xl uppercase items-center text-white shrink-0 whitespace-nowrap pr-12"
        >
            {KILLS.map((kill, i) => (
                <span key={i}>
                    [ 💀 KILL CONFIRMED: {kill} ]
                </span>
            ))}
        </motion.div>
    );
}
