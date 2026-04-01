import {
    ArrowUpRight,
    Bot,
    Leaf,
    Mail,
    Megaphone,
    Rss,
    Send,
    Sprout,
    Users,
    Wallet,
    Languages,
} from "lucide-react";

const helpWays = [
    {
        title: "Share the garden",
        description: "Send the garden to someone, share it publicly, or pass it along however feels natural.",
        icon: Send,
        ctaLabel: "Share",
        action: "share",
    },
    {
        title: "Use it in your work",
        description: "Bring ideas into your company, research, design, or practice.",
        icon: Sprout,
        ctaLabel: "Pathways",
        action: "pathways",
    },
    {
        title: "Translate or adapt ideas",
        description: "Rewrite, translate, remix, or reinterpret ideas for new audiences or formats.",
        icon: Languages,
        ctaLabel: "Pathways",
        action: "pathways",
    },
    {
        title: "Work with me",
        description: "Let's collaborate on something aligned.",
        icon: Users,
        ctaLabel: "Open contact form",
        action: "contact",
    },
];

const amplifiers = [
    {
        title: "Pinterest",
        description: "A visual channel for spreading ideas outward.",
        icon: Megaphone,
    },
    {
        title: "RSS",
        description: "A direct subscription path for readers who prefer feeds.",
        icon: Rss,
    },
    {
        title: "Newsletter",
        description: "A slower, more curated way for ideas to arrive.",
        icon: Mail,
    },
];

const upcomingGardens = [
    {
        title: "AI Garden",
        description: "Prompt systems, societal integration, ethics, customization, risks, and everyday use of LLMs.",
        icon: Bot,
    },
    {
        title: "Food Garden",
        description: "Plant-based food systems, ingredients, recipes, cooking shortcuts, and food philosophy.",
        icon: Leaf,
    },
];

type GrowthSectionProps = {
    onNavigateSection: (section: "home" | "about" | "pathways" | "growth") => void;
};

export function GrowthSection({ onNavigateSection }: GrowthSectionProps) {
    const siteUrl = "https://ideagarden.io";

    async function shareGarden() {
        const shareData = {
            title: "Idea Garden",
            text: "A living garden of ideas",
            url: siteUrl,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
                return;
            } catch {
                // user cancelled or sharing failed; fall through to copy
            }
        }

        try {
            await navigator.clipboard.writeText(siteUrl);
            window.alert("Link copied to clipboard.");
        } catch {
            window.prompt("Copy this link:", siteUrl);
        }
    }

    function goToPathways() {
        onNavigateSection("pathways");
    }

    function goToContactForm() {
        window.open("https://forms.gle/DQwBiimt9VFaTnZF7", "_blank", "noopener,noreferrer");
    }

    return (
        <section className="space-y-4">
            <section className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
                <section
                    className="glass-panel rounded-[2rem] border p-6 shadow-neu h-full"
                    style={{ borderColor: "var(--panel-border)", minHeight: 712 }}
                >
                    <div className="flex h-full flex-col">
                        <div className="flex items-start gap-3">
                            <div className="theme-panel-strong theme-text inline-flex h-11 w-11 items-center justify-center rounded-2xl shadow-neuSoft">
                                <Sprout className="h-5 w-5" />
                            </div>

                            <div>
                                <h2 className="theme-text text-2xl font-semibold">Ways to help</h2>
                                <p className="theme-text-soft mt-3 max-w-2xl leading-7">
                                    If you want to help this garden grow, start here. You can contribute money, share it with others, create from it, or volunteer directly.
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 grid flex-1 gap-4 sm:grid-cols-2 xl:grid-cols-2">
                            {helpWays.map((item) => {
                                const Icon = item.icon;

                                function handleCardClick() {
                                    if (item.action === "share") shareGarden();
                                    if (item.action === "pathways") goToPathways();
                                    if (item.action === "contact") goToContactForm();
                                }

                                return (
                                    <article
                                        key={item.title}
                                        role="button"
                                        tabIndex={0}
                                        onClick={handleCardClick}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" || e.key === " ") {
                                                e.preventDefault();
                                                handleCardClick();
                                            }
                                        }}
                                        className="group theme-panel rounded-[1.6rem] border p-5 shadow-neu flex flex-col justify-between cursor-pointer transition hover:-translate-y-0.5 hover:shadow-neuSoft hover:bg-[var(--surface-strong)] focus:outline-none"
                                        style={{ borderColor: "var(--panel-border)" }}
                                    >
                                        <div>
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="theme-panel-strong theme-text inline-flex h-11 w-11 items-center justify-center rounded-2xl shadow-neuSoft">
                                                    <Icon className="h-5 w-5" />
                                                </div>

                                                <div className="theme-text-soft inline-flex items-center gap-1 text-xs font-medium opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100">
                                                    {item.ctaLabel}
                                                    <ArrowUpRight className="h-3.5 w-3.5" />
                                                </div>
                                            </div>

                                            <h3 className="theme-text mt-4 text-lg font-semibold">
                                                {item.title}
                                            </h3>

                                            <p className="theme-text-soft mt-2 text-sm leading-6">
                                                {item.description}
                                            </p>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </div>
                </section>

                <aside
                    className="glass-panel rounded-[2rem] border p-6 shadow-neu"
                    style={{ borderColor: "var(--panel-border)" }}
                >
                    <div className="flex items-start gap-3">
                        <div className="theme-panel-strong theme-text inline-flex h-11 w-11 items-center justify-center rounded-2xl shadow-neuSoft">
                            <Wallet className="h-5 w-5" />
                        </div>

                        <div>
                            <h3 className="theme-text text-xl font-semibold">Contribute money</h3>
                            <p className="theme-text-soft mt-2 text-sm leading-6">
                                If this garden has brought value to your life or work, you can help nourish its growth here.
                            </p>
                        </div>
                    </div>

                    <div
                        className="theme-panel mt-6 rounded-[2rem] overflow-hidden border shadow-neu"
                        style={{ borderColor: "var(--panel-border)" }}
                    >
                        <iframe
                            id="kofiframe"
                            src="https://ko-fi.com/marianneperreault/?hidefeed=true&widget=true&embed=true&preview=true"
                            style={{ border: "none", width: "100%" }}
                            height={580}
                            title="Ko-fi contributions"
                        />
                    </div>
                </aside>
            </section>

            <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
                <aside
                    className="glass-panel rounded-[2rem] border p-6 shadow-neu h-full"
                    style={{ borderColor: "var(--panel-border)" }}
                >
                    <h3 className="theme-text text-xl font-semibold">Amplifiers</h3>
                    <p className="theme-text-soft mt-3 text-sm leading-6">
                        Future channels through which the garden can spread beyond the site.
                    </p>

                    <div className="mt-6 space-y-3">
                        {amplifiers.map((item) => {
                            const Icon = item.icon;

                            return (
                                <div
                                    key={item.title}
                                    className="rounded-[1.4rem] border p-4 opacity-60 shadow-neuInset"
                                    style={{
                                        borderColor: "var(--panel-border)",
                                        background: "var(--surface-strong)",
                                    }}
                                >
                                    <div className="flex items-start gap-3">
                                        <div
                                            className="theme-text inline-flex h-10 w-10 items-center justify-center rounded-2xl border opacity-70"
                                            style={{ borderColor: "var(--panel-border)" }}
                                        >
                                            <Icon className="h-4 w-4" />
                                        </div>

                                        <div className="min-w-0">
                                            <h4 className="theme-text text-base font-semibold">
                                                {item.title}
                                            </h4>

                                            <p className="theme-text-soft mt-1 text-sm leading-6">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </aside>

                <section
                    className="glass-panel rounded-[2rem] border p-6 shadow-neu h-full"
                    style={{ borderColor: "var(--panel-border)", minHeight: 420 }}
                >
                    <div className="flex h-full flex-col">
                        <div>
                            <h3 className="theme-text text-xl font-semibold">Upcoming gardens</h3>
                            <p className="theme-text-soft mt-3 text-sm leading-6">
                                These future spaces are already seeded, but not yet fully grown.
                            </p>
                        </div>

                        <div className="mt-6 grid flex-1 gap-4 md:grid-cols-2">
                            {upcomingGardens.map((garden) => {
                                const Icon = garden.icon;

                                return (
                                    <div
                                        key={garden.title}
                                        className="rounded-[1.6rem] border border-dashed p-5 opacity-65 shadow-neuInset flex flex-col"
                                        style={{
                                            borderColor: "var(--panel-border)",
                                            background: "var(--surface-strong)",
                                        }}
                                    >
                                        <div
                                            className="theme-text inline-flex h-11 w-11 items-center justify-center rounded-2xl border opacity-70"
                                            style={{ borderColor: "var(--panel-border)" }}
                                        >
                                            <Icon className="h-5 w-5" />
                                        </div>

                                        <h4 className="theme-text mt-4 text-lg font-semibold">
                                            {garden.title}
                                        </h4>

                                        <p className="theme-text-soft mt-2 text-sm leading-6">
                                            {garden.description}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            </section>
        </section>
    );
}