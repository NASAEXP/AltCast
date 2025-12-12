import { ShieldCheck, Article, TerminalWindow } from "@phosphor-icons/react/dist/ssr";

export function Protocol() {
    return (
        <section id="features" className="py-32 px-6 max-w-8xl mx-auto">
            <div className="flex items-center gap-4 mb-16">
                <div className="bg-acid text-black px-4 py-2 font-mono font-bold uppercase tracking-widest border border-acid shadow-glow-acid">
                    The Protocol
                </div>
                <div className="h-px bg-gray-800 flex-grow"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Feature 1 */}
                <div className="bg-pure-black text-white border border-gray-800 shadow-neo p-8 flex flex-col relative overflow-hidden interactive-el hover:shadow-glow-acid transition-all group">
                    <div className="absolute top-0 right-0 bg-acid text-black px-3 py-1 font-mono font-bold text-xs">01</div>
                    <h3 className="text-3xl font-black uppercase mb-4 text-acid">Kinetic <br />Stress Testing</h3>
                    <p className="font-mono text-sm text-gray-400 leading-relaxed mb-6">
                        We don't just "click around." We deploy hostile Playwright bots that hammer your API, flood your forms, and mimic chaotic users. We simulate the conditions your AI forgot to test.
                    </p>
                    <div className="mt-auto h-1 bg-acid w-12 group-hover:w-full transition-all duration-500"></div>
                </div>

                {/* Feature 2 */}
                <div className="bg-surface border border-gray-800 shadow-neo p-8 flex flex-col relative overflow-hidden interactive-el hover:-translate-y-2 transition-transform">
                    <div className="absolute top-0 right-0 bg-gray-800 text-white px-3 py-1 font-mono font-bold text-xs">02</div>
                    <h3 className="text-3xl font-black uppercase mb-4 text-white">The Forensic <br />Evidence</h3>
                    <p className="font-mono text-sm text-gray-500 leading-relaxed mb-6">
                        Stop guessing why it crashed. We send you a Trace File (Flight Recorder). Watch the exact millisecond your database locked up. See the network packets that killed your server.
                    </p>
                    <div className="mt-auto border border-gray-800 text-xs font-mono p-2 bg-black text-gray-400">
                        <div className="flex justify-between"><span>TRACE_ID:</span> <span>992-X</span></div>
                        <div className="flex justify-between text-danger"><span>ERROR:</span> <span>DEADLOCK</span></div>
                    </div>
                </div>

                {/* Feature 3 */}
                <div className="bg-purple text-white border border-purple shadow-neo p-8 relative overflow-hidden interactive-el hover:shadow-glow-danger transition-all">
                    <div className="absolute top-0 right-0 bg-black text-purple px-3 py-1 font-mono font-bold text-xs">03</div>
                    <h3 className="text-3xl font-black uppercase mb-4">The Remediation <br />Prompt</h3>
                    <p className="font-mono text-sm text-white/80 leading-relaxed mb-6">
                        We know you don't want to debug. We analyze the crash and send you the <strong className="text-white border-b border-white">Exact Prompt</strong> to paste back into Cursor.
                    </p>
                    <div className="bg-black/40 p-3 rounded font-mono text-[10px] border border-white/20">
                        <span className="text-acid">Input:</span> The Crash Log.<br />
                        <span className="text-acid">Output:</span> "Act as Senior React Dev..."<br />
                        <span className="text-acid">Result:</span> You Copy. You Paste.
                    </div>
                </div>
            </div>
        </section>
    );
}
