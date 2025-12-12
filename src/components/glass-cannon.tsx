import { WifiSlash, BracketsAngle, WarningOctagon } from "@phosphor-icons/react/dist/ssr";

export function GlassCannon() {
    return (
        <section className="py-24 px-6 max-w-8xl mx-auto border-b border-gray-800 bg-void">
            <div className="max-w-4xl mx-auto text-center mb-16">
                <h2 className="text-5xl font-black uppercase mb-6 text-white glitch-hover cursor-help inline-block">
                    The "Glass Cannon" Reality.
                </h2>
                <p className="text-xl text-gray-400 font-medium leading-relaxed">
                    You felt like a god building your MVP in a weekend. But deep down, you know the truth:
                    <span className="bg-acid px-1 font-bold text-black ml-2">You didn't write that code.</span>
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 text-center">
                {/* Card 1 */}
                <div className="p-6 border border-gray-800 bg-surface shadow-neo hover:translate-y-[-4px] transition-transform interactive-el group">
                    <div className="flex justify-center mb-4 text-purple group-hover:text-white transition-colors">
                        <WifiSlash size={48} weight="duotone" />
                    </div>
                    <h3 className="font-bold uppercase text-lg mb-2 text-white">The Race Condition</h3>
                    <p className="font-mono text-sm text-gray-500">What happens when a user double-clicks "Pay" on bad WiFi?</p>
                </div>

                {/* Card 2 */}
                <div className="p-6 border border-gray-800 bg-surface shadow-neo hover:translate-y-[-4px] transition-transform interactive-el group">
                    <div className="flex justify-center mb-4 text-danger group-hover:text-white transition-colors">
                        <BracketsAngle size={48} weight="duotone" />
                    </div>
                    <h3 className="font-bold uppercase text-lg mb-2 text-white">The Injection</h3>
                    <p className="font-mono text-sm text-gray-500">Did the AI sanitize the inputs on that new form?</p>
                </div>

                {/* Card 3 */}
                <div className="p-6 border border-gray-800 bg-surface shadow-neo hover:translate-y-[-4px] transition-transform interactive-el group">
                    <div className="flex justify-center mb-4 text-white">
                        <WarningOctagon size={48} weight="duotone" />
                    </div>
                    <h3 className="font-bold uppercase text-lg mb-2 text-white">The Crash</h3>
                    <p className="font-mono text-sm text-gray-500">Your user sees a generic error. You see a churned customer.</p>
                </div>
            </div>

            <div className="mt-16 text-center">
                <p className="font-black text-2xl uppercase border-b-4 border-danger text-white inline-block pb-1">
                    If you can't read the code, you can't fix the code. We do both.
                </p>
            </div>
        </section>
    );
}
