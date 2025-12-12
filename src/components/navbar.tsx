"use client";

import { motion } from "motion/react";
import { Terminal, List } from "@phosphor-icons/react";

export function Navbar() {
    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed w-full z-40 top-0 left-0 border-b border-gray-800 bg-void/90 backdrop-blur-md"
        >
            <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between">
                {/* Logo */}
                <a href="#" className="group flex items-center gap-3 interactive-el">
                    <div className="w-10 h-10 bg-acid text-black flex items-center justify-center border-2 border-acid group-hover:bg-white transition-colors shadow-glow-acid">
                        <Terminal weight="bold" className="text-2xl" />
                    </div>
                    <div className="flex flex-col leading-none">
                        <span className="font-black text-2xl tracking-tighter uppercase text-white">
                            AltCast_<span className="animate-blink text-acid">|</span>
                        </span>
                        <span className="font-mono text-[10px] font-bold tracking-widest text-acid">
                            [v5.1]
                        </span>
                    </div>
                </a>

                {/* Desktop Nav */}
                <div className="hidden lg:flex items-center gap-8">
                    <a href="/leaderboard" className="font-mono font-bold text-xs uppercase tracking-widest text-gray-400 hover:text-acid transition-colors interactive-el">
                        [ LEADERBOARD ]
                    </a>
                    <button className="interactive-el relative bg-acid text-black px-6 py-2 font-bold uppercase border-2 border-acid hover:shadow-glow-acid transition-all group overflow-hidden cursor-none">
                        <span className="relative z-10">[ INITIATE HOSTILE AUDIT ]</span>
                        <div className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-200 z-0"></div>
                    </button>
                </div>

                {/* Mobile Menu */}
                <button className="lg:hidden interactive-el p-2 border border-gray-700 text-white">
                    <List weight="bold" className="text-2xl" />
                </button>
            </div>
        </motion.nav>
    );
}
