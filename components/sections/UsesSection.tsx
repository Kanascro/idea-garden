import { MiniPanel } from "../ui/MiniPanel";

export function UsesSection() {
    return (
        <section className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
            <section className="rounded-[2rem] border border-white/60 glass-panel p-6 shadow-neu">
                <h2 className="text-2xl font-semibold">Uses</h2>
                <p className="mt-3 max-w-3xl leading-7 text-ink/75">
                    The garden is the raw material. The interfaces are how those ideas get shaped for actual humans in actual contexts: books, GenAI models, essays, talks, documentaries, children’s books, events, games, workshops, visual explainers, or things not imagined yet.
                </p>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <MiniPanel title="My projects">
                        I’m slowly turning parts of this garden into tangible formats — writing, tools, experiences, and other interfaces that make these ideas easier to explore or live through.
                    </MiniPanel>

                    <MiniPanel title="Build from this">
                        Take anything from this garden and turn it into something real: a project, a tool, a story, a community, a product, or something else. If it helps you create, it’s doing its job.
                    </MiniPanel>

                    <MiniPanel title="Commercial + free coexistence">
                        These ideas are free. Some interfaces around them can still be paid because packaging, audience fit, design, and validation are different layers of work.
                    </MiniPanel>

                    <MiniPanel title="Collaborations">
                        I work independently and am always open to collaborations.
                        If something here resonates and you’d like to work together, <a
                            href="https://www.linkedin.com/in/marianne-perreault/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative font-semibold text-indigo-500 transition hover:text-indigo-600"
                        >
                            <span className="relative z-10">reach out</span>
                            <span className="absolute inset-0 -z-0 rounded-lg bg-indigo-200 opacity-0 blur-md transition group-hover:opacity-60"></span>
                        </a>
                        .
                    </MiniPanel>
                </div>
            </section>

            <aside className="rounded-[2rem] border border-white/60 glass-panel p-6 shadow-neu">
                <h3 className="text-xl font-semibold">Donate</h3>
                <p className="mt-4 mb-4 text-sm leading-6 text-ink/68">
                    If you launched a for-profit project from these ideas, gained value from them or you wish to contribute to this garden, you can donate what feels appropriate here:
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