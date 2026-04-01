import {
    BookOpen,
    Box,
    Bot,
    Film,
    Gamepad2,
    GraduationCap,
    Mic2,
    Palette,
    PenSquare,
    Users,
} from "lucide-react";

const creationPaths = [
    {
        title: "Books",
        description: "Essays, futurist books, children’s books, field guides, or other written forms.",
        icon: BookOpen,
    },
    {
        title: "GenAI models",
        description: "Prompts, assistants, model instructions, or idea-based AI interfaces.",
        icon: Bot,
    },
    {
        title: "Essays",
        description: "Articles, manifestos, reflections, or public writing grown from the garden.",
        icon: PenSquare,
    },
    {
        title: "Talks",
        description: "Talks, lectures, live conversations, or spoken explorations of an idea.",
        icon: Mic2,
    },
    {
        title: "Documentaries",
        description: "Visual stories, explainers, interviews, or filmed interpretations.",
        icon: Film,
    },
    {
        title: "Games",
        description: "Interactive experiences, playful learning tools, or experimental systems.",
        icon: Gamepad2,
    },
    {
        title: "Workshops",
        description: "Group formats that help ideas become discussable and usable.",
        icon: Users,
    },
    {
        title: "Visual explainers",
        description: "Maps, diagrams, slides, illustrations, or educational visuals.",
        icon: Palette,
    },
    {
        title: "Projects",
        description: "Tools, communities, products, experiences, or things not imagined yet.",
        icon: Box,
    },
];

const upcomingProjects = [
    {
        title: "Futurist book",
        description: "A future book grown from ideas seeded in the garden.",
    },
    {
        title: "Humane digital life manifesto",
        description: "A UX-like manifesto for more humane digital environments.",
    },
];

export function PathwaysSection() {
    return (
        <section className="space-y-4">
            <section
                className="glass-panel rounded-[2rem] border p-6 shadow-neu"
                style={{ borderColor: "var(--panel-border)" }}
            >
                <h2 className="theme-text text-2xl font-semibold">Pathways</h2>
                <p className="theme-text-soft mt-3 max-w-3xl leading-7">
                    This garden can become many things. Some ideas may remain as notes. Others may grow into books, tools, workshops, essays, visual explainers, AI systems, events, games, or forms that do not exist yet.
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {creationPaths.map((item) => {
                        const Icon = item.icon;

                        return (
                            <div
                                key={item.title}
                                className="theme-panel rounded-[1.6rem] border p-5 shadow-neu"
                                style={{ borderColor: "var(--panel-border)" }}
                            >
                                <div className="theme-panel-strong theme-text inline-flex h-11 w-11 items-center justify-center rounded-2xl shadow-neuSoft">
                                    <Icon className="h-5 w-5" />
                                </div>

                                <h3 className="theme-text mt-4 text-lg font-semibold">
                                    {item.title}
                                </h3>

                                <p className="theme-text-soft mt-2 text-sm leading-6">
                                    {item.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </section>

            <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                <section
                    className="glass-panel rounded-[2rem] border p-6 shadow-neu"
                    style={{ borderColor: "var(--panel-border)" }}
                >
                    <h3 className="theme-text text-xl font-semibold">Upcoming projects</h3>
                    <p className="theme-text-soft mt-3 text-sm leading-6">
                        I’m slowly turning parts of this garden into tangible formats — writing, tools, experiences, and other interfaces that make these ideas easier to explore or live through.
                    </p>

                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                        {upcomingProjects.map((project) => (
                            <div
                                key={project.title}
                                className="rounded-[1.6rem] border border-dashed p-5 shadow-neuInset opacity-65 flex flex-col"
                                style={{
                                    borderColor: "var(--panel-border)",
                                    background: "var(--surface-strong)",
                                }}
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <h4 className="theme-text text-lg font-semibold">
                                        {project.title}
                                    </h4>
                                </div>

                                <p className="theme-text-soft mt-3 text-sm leading-6">
                                    {project.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                <aside
                    className="glass-panel rounded-[2rem] border p-6 shadow-neu"
                    style={{ borderColor: "var(--panel-border)" }}
                >
                    <h3 className="theme-text mt-4 text-xl font-semibold">Build from this</h3>
                    <p className="theme-text-soft mt-3 text-sm leading-6">
                        Take anything from this garden and turn it into something real: a project, a tool, a story, a community, a product, or something else. If it helps you create, it’s doing its job.
                    </p>

                    <div className="mt-5 rounded-[1.4rem] border p-4 shadow-neuInset"
                        style={{ borderColor: "var(--panel-border)" }}
                    >
                        <div className="flex items-start gap-3">
                            <GraduationCap className="theme-text mt-0.5 h-4 w-4 flex-shrink-0" />
                            <p className="theme-text-soft text-sm leading-6">
                                These ideas are free. Some interfaces around them can still be paid because packaging, audience fit, design, and validation are different layers of work.
                            </p>
                        </div>
                    </div>
                </aside>
            </section>
        </section>
    );
}