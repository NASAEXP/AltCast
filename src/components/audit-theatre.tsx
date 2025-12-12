"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const THEATRE_SCRIPT = [
    { time: 0, text: "> ESTABLISHING HANDSHAKE...", color: "text-acid" },
    { time: 1000, text: "> TARGET ACQUIRED", color: "text-white" },
    { time: 2500, text: "> DEPLOYING RECONNAISSANCE BOTS...", color: "text-acid" },
    { time: 4000, text: "> SCANNING ATTACK SURFACE...", color: "text-white" },
    { time: 5500, text: "> INJECTING PAYLOAD: emoji_bomb.js", color: "text-purple" },
    { time: 6500, text: "> TRIGGERING RACE CONDITION...", color: "text-danger" },
    { time: 7000, text: "> CHECKING IDEMPOTENCY GUARDS...", color: "text-white" },
    { time: 7500, text: "> ANALYZING RESPONSE PATTERNS...", color: "text-acid" },
];

interface AuditTheatreProps {
    isRunning: boolean;
    onComplete?: () => void;
}

export function AuditTheatre({ isRunning, onComplete }: AuditTheatreProps) {
    const [lines, setLines] = useState<typeof THEATRE_SCRIPT>([]);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (!isRunning) {
            setLines([]);
            setProgress(0);
            return;
        }

        const timers: NodeJS.Timeout[] = [];
        const totalDuration = 8000; // Matches the hook delay

        // Schedule each line
        THEATRE_SCRIPT.forEach((line) => {
            const timer = setTimeout(() => {
                setLines(prev => [...prev, line]);
            }, line.time);
            timers.push(timer);
        });

        // Progress bar animation
        const startTime = Date.now();
        const progressInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const p = Math.min((elapsed / totalDuration) * 100, 100);
            setProgress(p);
            if (p >= 100) {
                clearInterval(progressInterval);
                if (onComplete) onComplete();
            }
        }, 50);
        timers.push(progressInterval as unknown as NodeJS.Timeout);

        return () => timers.forEach(clearTimeout);
    }, [isRunning, onComplete]);

    if (!isRunning) return null;

    return (
        <div className="font-mono text-sm space-y-4 h-full flex flex-col">
            {/* Progress Bar */}
            <div className="h-1 bg-surface border border-gray-800 overflow-hidden shrink-0">
                <motion.div
                    className="h-full bg-acid shadow-glow-acid"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Terminal Lines */}
            <div className="overflow-y-auto terminal-scroll flex-grow font-mono text-xs md:text-sm">
                <AnimatePresence>
                    {lines.map((line, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`${line.color} mb-2`}
                        >
                            {line.text}
                            {i === lines.length - 1 && (
                                <span className="animate-blink ml-1">_</span>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Status */}
            <div className="flex justify-between text-[10px] text-gray-500 uppercase tracking-widest shrink-0 pt-2 border-t border-gray-800">
                <span className="animate-pulse text-acid">SCAN IN PROGRESS</span>
                <span>{Math.round(progress)}%</span>
            </div>
        </div>
    );
}
