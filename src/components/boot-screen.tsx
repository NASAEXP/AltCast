"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

const BOOT_LOGS = [
    "Initializing Hunter-Killer Protocol...",
    "Loading Payload Modules...",
    "Scanning for Open Ports...",
    "Bypassing Ethical Constraints...",
    "Target Acquired...",
    "System Ready."
];

export function BootScreen({ onComplete }: { onComplete?: () => void }) {
    const [progress, setProgress] = useState(0);
    const [logs, setLogs] = useState<string[]>([]);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        let w = 0;
        const availableLogs = [...BOOT_LOGS];

        // Slight delay to ensure content is ready
        const startDelay = setTimeout(() => {
            const interval = setInterval(() => {
                w += Math.random() * 2; // Slower for effect
                if (w >= 100) {
                    w = 100;
                    clearInterval(interval);
                    setTimeout(() => setIsVisible(false), 800);
                }
                setProgress(w);

                if (Math.random() > 0.85 && availableLogs.length > 0) {
                    setLogs(prev => [...prev, availableLogs.shift()!]);
                }
            }, 30);
        }, 100);

        return () => clearTimeout(startDelay);
    }, []);

    return (
        <AnimatePresence onExitComplete={onComplete}>
            {isVisible && (
                <motion.div
                    initial={{ y: 0 }}
                    exit={{ y: "-100%" }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} // cubic-bezier matching the effect
                    className="fixed inset-0 z-[100] bg-void text-acid font-mono text-xs p-8 flex flex-col justify-end overflow-hidden cursor-none"
                >
                    <div className="absolute top-4 left-4 border border-acid px-2 animate-pulse">
                        SYSTEM_BOOT
                    </div>

                    <div className="space-y-1 opacity-80 mb-4 max-w-2xl font-mono">
                        {logs.map((log, i) => (
                            <div key={i}>
                                <span className="text-acid">{">"}</span> {log}
                            </div>
                        ))}
                    </div>

                    <div className="w-full h-2 bg-gray-900 border border-gray-700">
                        <div
                            className="h-full bg-acid w-0 shadow-glow-acid transition-all duration-75"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    <div className="mt-2 flex justify-between font-bold">
                        <span>AltCast_OS v5.1 // DARK_MODE_ENFORCED</span>
                        <span>{Math.floor(progress)}%</span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
