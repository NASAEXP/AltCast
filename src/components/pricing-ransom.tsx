import { Warning, Check, ShieldCheck } from "@phosphor-icons/react/dist/ssr";

export function PricingRansom() {
    return (
        <section id="pricing" className="py-32 bg-void border-t border-gray-800">
            <div className="max-w-6xl mx-auto px-6">
                <h2 className="text-6xl font-black uppercase text-center mb-16 text-white">
                    The Ransom <span className="block text-2xl text-acid font-mono mt-2 tracking-widest bg-surface border border-gray-700 w-fit mx-auto px-2 transform -skew-x-12">"ZERO-DAY" GUARANTEE</span>
                </h2>

                <div className="grid md:grid-cols-2 gap-8 items-center max-w-4xl mx-auto">
                    {/* Card 1 (Dark Grey) */}
                    <div className="bg-surface border border-gray-700 p-8 shadow-neo hover:translate-y-[-5px] transition-transform interactive-el flex flex-col h-full group">
                        <h3 className="text-3xl font-black uppercase text-white">The Bounty</h3>
                        <p className="font-mono text-xs text-gray-500 mt-2 mb-6 uppercase tracking-widest">One-time Audit</p>

                        <div className="text-6xl font-black mb-8 text-white">$299</div>

                        <ul className="space-y-4 font-mono text-sm mb-8 flex-grow text-gray-400">
                            <li className="flex gap-2 items-start">
                                <Warning weight="bold" className="text-black bg-acid rounded-full p-0.5 text-[20px] mt-0.5 shrink-0" />
                                <span>The Survival Probability: <span className="text-danger font-bold">&lt;5%</span>. Badge is scarce.</span>
                            </li>
                            <li className="flex gap-2 items-start">
                                <Check weight="bold" className="text-acid mt-1 shrink-0" />
                                <span>If we break it: Video Evidence + Fix Prompt.</span>
                            </li>
                        </ul>
                        <button className="w-full bg-transparent text-white border-2 border-white py-4 font-bold uppercase hover:bg-white hover:text-black transition-colors interactive-el">
                            Deploy Hunter-Killer
                        </button>
                    </div>

                    {/* Card 2 (Black) */}
                    <div className="bg-black text-white border border-acid p-10 shadow-glow-acid transform md:scale-105 relative z-10 interactive-el h-full flex flex-col group">
                        <div className="absolute top-0 right-0 bg-acid text-black px-4 py-1 font-bold text-xs uppercase tracking-widest">Immunity</div>
                        <h3 className="text-3xl font-black uppercase text-acid">The Night Watch</h3>
                        <p className="font-mono text-xs text-gray-500 mt-2 mb-6 uppercase tracking-widest">24/7 Surveillance</p>

                        <div className="text-6xl font-black mb-8">$2,500<span className="text-2xl text-gray-500">/mo</span></div>

                        <ul className="space-y-4 font-mono text-sm mb-8 text-gray-300 flex-grow">
                            <li className="flex gap-2 items-center"><ShieldCheck weight="bold" className="text-acid" /> Continuous Stress Testing</li>
                            <li className="flex gap-2 items-center"><ShieldCheck weight="bold" className="text-acid" /> CI/CD Pipeline Injection</li>
                            <li className="flex gap-2 items-center"><ShieldCheck weight="bold" className="text-acid" /> Priority Remediation Team</li>
                        </ul>
                        <button className="w-full bg-acid text-black border-2 border-acid py-4 font-black uppercase hover:bg-black hover:text-acid transition-colors interactive-el">
                            Secure The Perimeter
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
