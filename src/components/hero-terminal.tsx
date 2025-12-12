"use client";

import { useEffect, useState } from "react";
import { useAuditForm } from "@/hooks/use-audit-form";
import { AuditTheatre } from "./audit-theatre";
import { motion, AnimatePresence } from "motion/react";
import { Skull } from "@phosphor-icons/react";

// Terminal demo script - runs when idle
const DEMO_COMMANDS = [
    { text: "> SYSTEM READY", color: "text-acid", delay: 0 },
    { text: "> TARGET ACQUIRED: v5.1-signup-flow", color: "text-acid", delay: 800 },
    { text: '> INJECTING: "😀😀😀" into field: email', color: "text-white", delay: 1800 },
    { text: "> INJECTING: Double-Click Event (300ms)", color: "text-white", delay: 2800 },
    { text: "> RESULT: 500 INTERNAL SERVER ERROR", color: "text-danger font-bold", delay: 3800 },
    { text: "> VULNERABILITY CONFIRMED.", color: "text-danger animate-pulse", delay: 4800 },
    { text: "", color: "", delay: 6000 }, // Pause
    { text: "> AWAITING NEW TARGET...", color: "text-gray-500", delay: 7000 },
];

function TerminalDemo() {
    const [lines, setLines] = useState<typeof DEMO_COMMANDS>([]);
    const [cycle, setCycle] = useState(0);

    useEffect(() => {
        const timers: NodeJS.Timeout[] = [];

        // Reset lines at start of each cycle
        setLines([]);

        // Schedule each line
        DEMO_COMMANDS.forEach((cmd, index) => {
            if (cmd.text) {
                const timer = setTimeout(() => {
                    setLines(prev => [...prev, cmd]);
                }, cmd.delay);
                timers.push(timer);
            }
        });

        // Restart cycle after all commands
        const restartTimer = setTimeout(() => {
            setLines([]);
            setCycle(c => c + 1);
        }, 9000);
        timers.push(restartTimer);

        return () => timers.forEach(clearTimeout);
    }, [cycle]);

    return (
        <div className="space-y-2 mt-4">
            <AnimatePresence>
                {lines.map((line, i) => (
                    <motion.div
                        key={`${cycle}-${i}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`${line.color} font-mono text-sm`}
                    >
                        {line.text}
                        {i === lines.length - 1 && (
                            <span className="animate-pulse ml-1">█</span>
                        )}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}

export function HeroTerminal() {
    const { url, setUrl, result, auditSlug, handleAudit, unlockReport } = useAuditForm();

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleAudit();
    };

    return (
        <main className="pt-32 pb-20 overflow-hidden relative min-h-screen flex flex-col justify-center border-b border-gray-800 bg-void">
            <div className="max-w-[1600px] mx-auto px-6 grid lg:grid-cols-12 gap-12 w-full z-10 relative">

                {/* Left Column: Copy & Input */}
                <div className="lg:col-span-6 flex flex-col justify-center z-20">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="text-6xl xl:text-8xl font-black leading-[0.85] mb-8 text-white mix-blend-normal uppercase tracking-tight"
                    >
                        Your AI wrote <br /> the code. <br />
                        <span className="text-danger glitch-hover cursor-help">It didn't check</span> <br />
                        the consequences.
                    </motion.h1>

                    <motion.h2
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="text-xl font-medium text-gray-400 mb-10 max-w-xl leading-relaxed border-l-4 border-acid pl-6 bg-surface/50 backdrop-blur-sm p-4"
                    >
                        You built it fast. Now make it bulletproof.
                        <span className="font-bold text-white block mt-2">AltCast is the hostile user you forgot to test for.</span>
                        <span className="text-xs text-gray-500 block mt-2">We test your UI like a malicious user would — no server attacks, just real user chaos.</span>
                    </motion.h2>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 }}
                        className="w-full max-w-lg"
                    >
                        <div className="bg-pure-black p-2 border border-gray-700 shadow-neo group hover:border-acid transition-colors">
                            <div className="bg-[#0f0f0f] border border-gray-800 flex items-center p-3 gap-2 mb-2">
                                <span className="text-acid font-mono font-bold">root@altcast:~$</span>
                                <span className="text-gray-400 font-mono text-sm">target --url</span>
                                <input
                                    type="text"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    disabled={result.state === "scanning" || result.state === "results"}
                                    placeholder="getaltcast.com"
                                    className="bg-transparent border-none text-white font-mono text-sm focus:outline-none w-full caret-acid placeholder-gray-700 disabled:opacity-50"
                                />
                            </div>
                            <button
                                onClick={handleAudit}
                                disabled={result.state === "scanning" || !url}
                                className="w-full bg-acid text-black font-black uppercase py-4 hover:bg-white transition-colors interactive-el tracking-widest text-lg border-2 border-acid disabled:opacity-50 disabled:cursor-not-allowed group-hover:shadow-glow-acid"
                            >
                                {result.state === "scanning" ? "[ DEPLOYING CHAOS... ]" : "[ DEPLOY CHAOS ]"}
                            </button>
                        </div>
                        <p className="font-mono text-[10px] text-gray-600 mt-2 text-center uppercase tracking-wider">
                            No credit card. We only charge if we find blood.
                        </p>
                    </motion.div>
                </div>

                {/* Right Column: Terminal Visual */}
                <div className="lg:col-span-6 relative h-[600px] bg-pure-black border border-gray-800 shadow-neo-lg overflow-hidden interactive-el flex flex-col hover:border-acid/50 transition-colors">
                    {/* Terminal Header */}
                    <div className="h-10 bg-[#0f0f0f] border-b border-gray-800 flex items-center justify-between px-4 z-30 pointer-events-none">
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-danger/80"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                            <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                        </div>
                        <div className="font-mono text-xs font-bold uppercase tracking-widest text-gray-600">bash — hostile_audit_v5.sh</div>
                    </div>

                    {/* Terminal Body */}
                    <div className="p-6 font-mono text-sm text-acid flex-grow relative overflow-hidden flex flex-col">
                        {result.state === "idle" && (
                            <TerminalDemo />
                        )}

                        {result.state === "scanning" && (
                            <AuditTheatre isRunning={true} onComplete={() => { }} />
                        )}

                        {(result.state === "results" || result.state === "email_gate" || result.state === "captured") && (() => {
                            // Filter to only show critical and warning findings
                            const threats = result.vulnerabilities.filter(v => v.severity === "critical" || v.severity === "warning");
                            const hasCritical = threats.some(v => v.severity === "critical");
                            const totalChecks = result.vulnerabilities.length;

                            return (
                                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full overflow-y-auto terminal-scroll">
                                    <div className={`border p-4 ${hasCritical ? "border-danger bg-danger/10" : threats.length > 0 ? "border-yellow-500 bg-yellow-500/10" : "border-emerald-500 bg-emerald-500/10"}`}>
                                        <div className={`flex items-center gap-2 font-bold mb-4 uppercase tracking-widest border-b pb-2 ${hasCritical ? "text-danger border-danger/50" : threats.length > 0 ? "text-yellow-400 border-yellow-500/50" : "text-emerald-400 border-emerald-500/50"}`}>
                                            <Skull size={24} weight="fill" />
                                            {hasCritical ? "CRITICAL THREATS DETECTED" : threats.length > 0 ? `${threats.length} ISSUES FOUND` : `ALL ${totalChecks} CHECKS PASSED`}
                                        </div>
                                        {threats.length > 0 ? (
                                            <ul className="space-y-3">
                                                {threats.map((v, i) => (
                                                    <li key={i} className="flex justify-between items-start gap-4">
                                                        <div>
                                                            <span className="text-white font-bold block">{v.code}</span>
                                                            <span className="text-gray-400 text-xs">{v.description}</span>
                                                        </div>
                                                        <span className={`uppercase text-xs border px-1 ${v.severity === "critical" ? "text-danger border-danger" : "text-yellow-400 border-yellow-500"}`}>{v.severity}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <div className="text-center py-4">
                                                <span className="text-emerald-400 font-mono text-sm">✓ No critical vulnerabilities detected</span>
                                                <p className="text-gray-500 text-xs mt-2">Target passed all {totalChecks} security checks</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="bg-surface p-4 border border-gray-800 text-center relative overflow-hidden">
                                        <p className="text-white font-bold mb-2 uppercase">Evidence File Locked (44MB)</p>
                                        {result.state !== "captured" ? (
                                            <div className="mt-4">
                                                <div className="flex gap-2 mb-2">
                                                    <input type="email" placeholder="enter@email.com" className="bg-black border border-gray-700 px-3 py-2 text-white w-full font-mono text-xs focus:outline-none focus:border-acid transition-colors" />
                                                    <button onClick={() => unlockReport("test@test.com", auditSlug || undefined)} className="bg-acid text-black px-4 py-2 font-bold uppercase text-xs whitespace-nowrap hover:bg-white transition-colors border border-acid">
                                                        Unlock
                                                    </button>
                                                </div>
                                                <p className="text-[10px] text-gray-500">Video evidence of exploit + remediation steps.</p>
                                            </div>
                                        ) : (
                                            <div className="text-acid font-bold mt-2 border border-acid p-2 bg-acid/10">
                                                ✓ LINK SENT TO INBOX
                                            </div>
                                        )}
                                    </div>

                                    <div className="text-xs text-gray-600 text-center pt-8 pb-4">
                                        SESSION_ID: {Math.random().toString(36).substring(7).toUpperCase()}
                                        {auditSlug && <span className="block text-acid mt-1">SLUG: {auditSlug}</span>}
                                    </div>
                                </div>
                            )
                        })()}
                    </div>

                    {/* Gradient Overlay */}
                    <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent pointer-events-none"></div>
                </div>
            </div>
        </main>
    );
}

