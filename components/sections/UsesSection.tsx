import { MiniPanel } from "../ui/MiniPanel";

export function UsesSection() {
    return (
        <section className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
            <section className="rounded-[2rem] border border-white/60 glass-panel p-6 shadow-neu">
                <h2 className="text-2xl font-semibold">Uses</h2>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <MiniPanel title="My projects">
                        I’m slowly turning parts of this garden into tangible formats.
                    </MiniPanel>

                    <MiniPanel title="Build from this">
                        Take anything from this garden and turn it into something real.
                    </MiniPanel>

                    <MiniPanel title="Commercial + free coexistence">
                        These ideas are free. Interfaces built from them can still be paid.
                    </MiniPanel>

                    <MiniPanel title="Collaborations">
                        I work independently and am open to collaborations.
                    </MiniPanel>
                </div>
            </section>

            <aside className="rounded-[2rem] border border-white/60 glass-panel p-6 shadow-neu">
                <h3 className="text-xl font-semibold">Donate</h3>
                <p className="mt-4 mb-4 text-sm leading-6 text-ink/68">
                    If this garden helped you, you can support it here.
                </p>

                <div className="rounded-[2rem] overflow-hidden border border-white/60 shadow-neu">
                    <iframe
                        id="kofiframe"
                        src="https://ko-fi.com/marianneperreault/?hidefeed=true&widget=true&embed=true&preview=true"
                        style={{ border: "none", width: "100%" }}
                        height={712}
                        title="marianneperreault"
                    />
                </div>
            </aside>
        </section>
    );
}