import { TerminalWindow } from "@phosphor-icons/react/dist/ssr";

export function Footer() {
    return (
        <footer className="bg-black text-white pt-24 pb-12 border-t border-gray-800 relative overflow-hidden">
            <div className="max-w-8xl mx-auto px-6 grid md:grid-cols-2 gap-12 relative z-10">
                <div>
                    <TerminalWindow weight="bold" className="text-6xl text-acid mb-6 block" />
                    <h2 className="text-4xl font-black uppercase mb-6 leading-none">AltCast Systems.</h2>
                    <p className="font-mono text-gray-400 mb-6">The Code Janitor for the AI Age.<br />
                        Operating from Iligan City
                        {/* LOGISTICS STAMP */}
                        <span className="font-mono text-[10px] tracking-[0.3em] bg-white text-black px-2 py-0.5 inline-block ml-2 opacity-80 rotate-3 select-none" title="Logistics Node: ACTIVE">||| || ||| ||</span>
                        / Cloud.
                    </p>
                    <div className="flex gap-4">
                        <a href="#" className="px-4 py-2 border border-gray-700 font-mono text-xs hover:bg-white hover:text-black transition-colors interactive-el">Twitter / X</a>
                        <a href="#" className="px-4 py-2 border border-gray-700 font-mono text-xs hover:bg-white hover:text-black transition-colors interactive-el">Github</a>
                    </div>
                    <div className="mt-4 font-mono text-xs text-danger">breach@getaltcast.com</div>
                </div>
            </div>
            <div className="max-w-8xl mx-auto px-6 mt-20 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-xs font-mono text-gray-600">
                <p>&copy; 2025 ALTCAST SYSTEMS. NO SURVIVORS.</p>
                <p className="mt-4 md:mt-0">DESIGNED IN THE VOID.</p>
            </div>
        </footer>
    );
}
