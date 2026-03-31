import { MiniPanel } from "../ui/MiniPanel";

export function UsesSection() {
    return (
        <section className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
            <section
                className="glass-panel rounded-[2rem] border p-6 shadow-neu"
                style={{ borderColor: "var(--panel-border)" }}
            >
                <h2 className="theme-text text-2xl font-semibold">Uses</h2>
                <p className="theme-text-soft mt-3 max-w-3xl leading-7">
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
                            className="theme-text relative font-semibold transition hover:opacity-80"
                        >
                            <span className="relative z-10">reach out</span>
                            <span
                                className="absolute inset-0 -z-0 rounded-lg opacity-0 blur-md transition"
                                style={{ background: "var(--accent-bg-strong)" }}
                            ></span>
                        </a>
                        .
                    </MiniPanel>
                </div>
            </section>

            <aside
                className="glass-panel rounded-[2rem] border p-6 shadow-neu"
                style={{ borderColor: "var(--panel-border)" }}
            >
                <h3 className="theme-text text-xl font-semibold">Donate</h3>
                <p className="theme-text-soft mt-4 mb-4 text-sm leading-6">
                    If you launched a for-profit project from these ideas, gained value from them or you wish to contribute to this garden, you can donate what feels appropriate here:
                </p>

                <div
                    className="theme-panel rounded-[2rem] overflow-hidden border shadow-neu"
                    style={{ borderColor: "var(--panel-border)" }}
                >

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