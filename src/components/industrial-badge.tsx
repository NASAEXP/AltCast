"use client";

import { cn } from "@/lib/utils";

interface IndustrialBadgeProps {
    rank: 1 | 2 | 3 | 4 | 5;
    className?: string;
}

const RANK_CONFIG = {
    5: {
        label: "CLASS 05",
        sublabel: "INFRASTRUCTURE",
        color: "text-amber-400",
        bgColor: "bg-amber-400/10",
        borderColor: "border-amber-400/50",
        glowClass: "shadow-[0_0_10px_rgba(251,191,36,0.3)]",
    },
    4: {
        label: "CLASS 04",
        sublabel: "ENTERPRISE",
        color: "text-blue-400",
        bgColor: "bg-blue-400/10",
        borderColor: "border-blue-400/50",
        glowClass: "",
    },
    3: {
        label: "CLASS 03",
        sublabel: "STANDARD",
        color: "text-emerald-400",
        bgColor: "bg-emerald-400/10",
        borderColor: "border-emerald-400/50",
        glowClass: "",
    },
    2: {
        label: "CLASS 02",
        sublabel: "PROVISIONAL",
        color: "text-yellow-400",
        bgColor: "bg-yellow-400/10",
        borderColor: "border-yellow-400/50",
        glowClass: "",
    },
    1: {
        label: "CLASS 01",
        sublabel: "CRITICAL",
        color: "text-red-500",
        bgColor: "bg-red-500/10",
        borderColor: "border-red-500/50",
        glowClass: "shadow-[0_0_10px_rgba(239,68,68,0.3)]",
    },
};

export function IndustrialBadge({ rank, className }: IndustrialBadgeProps) {
    const config = RANK_CONFIG[rank];

    return (
        <div
            className={cn(
                "inline-flex flex-col items-center px-3 py-1.5 border font-mono",
                config.bgColor,
                config.borderColor,
                config.glowClass,
                className
            )}
        >
            <span className={cn("text-xs font-bold tracking-widest", config.color)}>
                {config.label}
            </span>
            <span className="text-[9px] text-gray-500 tracking-wider">
                {config.sublabel}
            </span>
        </div>
    );
}

export default IndustrialBadge;
