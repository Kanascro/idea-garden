"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  FolderTree,
  Search,
  Share2,
  Sparkles,
  X,
  Link2,
  HeartHandshake,
  LibraryBig,
  Compass,
	Shapes,
	Lightbulb,
	Bot,
	UserRound,
} from "lucide-react";
import type { IdeaIndex, IdeaItem } from "../lib/types";

type Props = {
  initialData: IdeaIndex;
};

type HomeSection = "ideas" | "about" | "uses";

function normalize(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function buildSearchText(idea: IdeaItem) {
  return normalize(
    [
      idea.title,
      idea.categoryTrail.join(" "),
      idea.content.coreIdea,
      idea.content.structure,
      idea.content.humanSignal,
    ].join(" \n ")
  );
}

function scoreIdea(idea: IdeaItem, query: string) {
  const q = normalize(query).trim();
  if (!q) return 0;

  const hay = buildSearchText(idea);
  let score = 0;

  if (normalize(idea.title).includes(q)) score += 8;
  if (normalize(idea.categoryTrail.join(" ")).includes(q)) score += 4;
  if (hay.includes(q)) score += 2;

  const terms = q.split(/\s+/).filter(Boolean);
  for (const term of terms) {
    if (normalize(idea.title).includes(term)) score += 3;
    if (hay.includes(term)) score += 1;
  }

  return score;
}

export default function IdeaVaultApp({ initialData }: Props) {
  const [query, setQuery] = useState("");
  const [activeIdea, setActiveIdea] = useState<IdeaItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [homeSection, setHomeSection] = useState<HomeSection>("ideas");
  const [selectedTopFolder, setSelectedTopFolder] = useState<string>("All");
  const [copied, setCopied] = useState(false);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [visibleIdea, setVisibleIdea] = useState<IdeaItem | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const asideRef = useRef<HTMLDivElement | null>(null);
	const [hasOverflow, setHasOverflow] = useState(false);

  const ideas = initialData.ideas;

	const categories = useMemo(() => {
	  const set = new Set<string>();
	  for (const idea of ideas) {
		const top = idea.categoryTrail[0] ?? "Uncategorized";
		if (selectedTopFolder !== "All" && top !== selectedTopFolder) continue;
		if (idea.categoryTrail.length <= 1) continue;
		set.add(idea.categoryTrail.slice(1).join(" / "));
	  }
	  return ["All", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
	}, [ideas, selectedTopFolder]);

	const topFolders = useMemo(() => {
	  const counts = new Map<string, number>();
	  for (const idea of ideas) {
		const top = idea.categoryTrail[0] ?? "Uncategorized";
		counts.set(top, (counts.get(top) ?? 0) + 1);
	  }
	  return [
		{ name: "All", count: ideas.length },
		...Array.from(counts.entries())
		  .sort((a, b) => a[0].localeCompare(b[0]))
		  .map(([name, count]) => ({ name, count })),
	  ];
	}, [ideas]);

  const filteredIdeas = useMemo(() => {
    let next = ideas;
	if (selectedTopFolder !== "All") {
	  next = next.filter((idea) => (idea.categoryTrail[0] ?? "Uncategorized") === selectedTopFolder);
	}
    if (selectedCategory !== "All") {
      next = next.filter((idea) => idea.categoryTrail.slice(1).join(" / ") === selectedCategory);

    }

    if (!query.trim()) return next;

    return [...next]
      .map((idea) => ({ idea, score: scoreIdea(idea, query) }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score || a.idea.title.localeCompare(b.idea.title))
      .map((entry) => entry.idea);
  }, [ideas, query, selectedCategory, selectedTopFolder]);

	useEffect(() => {
	  setSelectedCategory("All");
	}, [selectedTopFolder]);

useEffect(() => {
  function syncFiltersForScreen() {
    if (window.innerWidth >= 1024) {
      setFiltersOpen(true);
    } else {
      setFiltersOpen(false);
    }
  }

  syncFiltersForScreen();
  window.addEventListener("resize", syncFiltersForScreen);
  return () => window.removeEventListener("resize", syncFiltersForScreen);
}, []);

useEffect(() => {
  function check() {
    const el = asideRef.current;
    if (!el) return;

    const isOverflowing = el.scrollHeight > el.clientHeight;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
    setHasOverflow(isOverflowing && !atBottom);
  }

  check();

  const el = asideRef.current;
  if (el) {
    el.addEventListener("scroll", check);
  }

  window.addEventListener("resize", check);

  return () => {
    if (el) {
      el.removeEventListener("scroll", check);
    }
    window.removeEventListener("resize", check);
  };
}, [filtersOpen]);

  useEffect(() => {
    const hash = decodeURIComponent(window.location.hash.replace(/^#/, ""));
    if (!hash) return;
    const found = ideas.find((idea) => idea.slug === hash);
    if (found) setActiveIdea(found);
  }, [ideas]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setActiveIdea(null);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!activeIdea) return;
    window.history.replaceState(null, "", `#${encodeURIComponent(activeIdea.slug)}`);
    setCopied(false);
  }, [activeIdea]);

  useEffect(() => {
    if (!activeIdea && window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  }, [activeIdea]);

  async function handleShare(idea: IdeaItem) {
    const url = `${window.location.origin}${window.location.pathname}#${encodeURIComponent(idea.slug)}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: idea.title,
          text: idea.content.coreIdea,
          url,
        });
        return;
      } catch {
        // fall through to clipboard
      }
    }

    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }
  
  function openIdea(idea: IdeaItem) {
    setVisibleIdea(idea);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsModalOpen(true);
      });
    });
  }

  function closeIdea() {
    setIsModalOpen(false);
    setTimeout(() => {
      setVisibleIdea(null);
    }, 200);
  }

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="rounded-[2rem] border border-white/50 bg-aura p-6 shadow-neu sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/50 px-3 py-1 text-sm shadow-neuSoft">
                <Sparkles className="h-4 w-4" />
                Public, free, remixable ideas
              </p>
              <h1 className="text-4xl font-semibold tracking-[0.08em] sm:text-5xl">Marianne's idea garden</h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-ink/75 sm:text-lg">
                A free garden of ideas, structures, and paradigms. A
                collection people can browse, share, adopt, or adapt into creations of their own.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 rounded-[1.5rem] border border-white/70 bg-white/45 p-2 shadow-neuSoft">
              <button
				  onClick={() => setHomeSection("about")}
				  className={`rounded-[1.15rem] px-4 py-3 text-sm font-medium transition ${
					homeSection === "about" ? "bg-white shadow-neuSoft" : "hover:bg-white/50"
				  }`}
				>
				  About
				</button>
				<button
				  onClick={() => setHomeSection("ideas")}
				  className={`rounded-[1.15rem] px-4 py-3 text-sm font-medium transition ${
					homeSection === "ideas" ? "bg-white shadow-neuSoft" : "hover:bg-white/50"
				  }`}
				>
				  Ideas
				</button>
				<button
				  onClick={() => setHomeSection("uses")}
				  className={`rounded-[1.15rem] px-4 py-3 text-sm font-medium transition ${
					homeSection === "uses" ? "bg-white shadow-neuSoft" : "hover:bg-white/50"
				  }`}
				>
				  Uses
			</button>
            </div>
          </div>
        </header>

        {homeSection === "about" && (
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <InfoCard
              icon={<LibraryBig className="h-5 w-5" />}
              title="What this is"
              body="A public collection of idea-notes. They are free to read, reuse, adapt, and transform into books, talks, games, tools, workshops, or other interfaces."
            />
            <InfoCard
              icon={<HeartHandshake className="h-5 w-5" />}
              title="Use and reuse"
              body="No permission or credit required. Mentions and tips are appreciated. The point is circulation, not gatekeeping."
            />
			<InfoCard
			  icon={<Sparkles className="h-5 w-5" />}
			  title="AI assisted"
			  body="These ideas and this website were ripened, clarified, expanded, and reformulated using Generative AI."
			/>
			<InfoCard
			  icon={<Compass className="h-5 w-5" />}
			  title="Selective resonance"
			  body="Some ideas may resonate strongly. Others may do nothing for you. That is expected."
			/>
			<InfoCard
			  icon={<Lightbulb className="h-5 w-5" />}
			  title="Not truth"
			  body="These are ideas, lenses, provocations, and possibilities — they don't pretend to be truth."
			/>
			<InfoCard
			  icon={<Bot className="h-5 w-5" />}
			  title="Possible contradictions"
			  body="Some notes may contradict each other. The garden is exploratory."
			/>
          </section>
        )}

        {homeSection === "uses" && (
          <section className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
            <section className="rounded-[2rem] border border-white/60 glass-panel p-6 shadow-neu">
              <h2 className="text-2xl font-semibold">Uses</h2>
              <p className="mt-3 max-w-3xl leading-7 text-ink/75">
                The garden is the raw material. The interfaces are how those ideas get shaped for
                actual humans in actual contexts: books, GenAI models, essays, talks, documentaries,
                children’s books, events, games, workshops, visual explainers, or things not
                imagined yet.
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
				<MiniPanel title="My projects">
				  I’m slowly turning parts of this garden into tangible formats — writing,
				  tools, experiences, and other interfaces that make these ideas easier to
				  explore or live through.
				</MiniPanel>

				<MiniPanel title="Build from this">
				  Take anything from this garden and turn it into something real:
				  a project, a tool, a story, a community, a product, or something else. If it helps you create, it’s doing its job.
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
                {/* <SoftButton>Support on Ko-fi</SoftButton> */}
				<div className="rounded-[2rem] overflow-hidden border border-white/60 shadow-neu">
				<iframe
				  id="kofiframe"
				  src="https://ko-fi.com/marianneperreault/?hidefeed=true&widget=true&embed=true&preview=true"
				  style={{
					border: "none",
					width: "100%",
				  }}
				  height={712}
				  title="marianneperreault"
				/></div>
              
            </aside>
          </section>
        )}

        {homeSection === "ideas" && (
  <section className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
<aside className="relative overflow-hidden rounded-[2rem] border border-white/60 glass-panel p-4 shadow-neu lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] ">
  <div
    ref={asideRef}
    className="lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto no-scrollbar"
  >
    <button
      onClick={() => setFiltersOpen((v) => !v)}
      className="mb-4 flex w-full items-center justify-between rounded-[1.25rem] border border-white/70 bg-white/60 px-4 py-3 text-sm font-medium shadow-neuSoft lg:hidden"
    >
      <span>Filters</span>
      <span>{filtersOpen ? "−" : "+"}</span>
    </button>

    {filtersOpen && (
      <>
        <div className="rounded-[1.5rem] border border-white/70 bg-white/45 p-3 shadow-neuInset">
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-ink/75">
            <Search className="h-4 w-4" />
            Search the vault
          </label>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Title, category, structure, signal..."
            className="w-full rounded-2xl border border-white/70 bg-white px-4 py-3 text-sm outline-none ring-0 placeholder:text-ink/40"
          />
        </div>

        <div className="mt-4 rounded-[1.5rem] border border-white/70 bg-white/45 p-3 shadow-neuInset">
          <p className="mb-3 text-sm font-medium text-ink/75">Categories</p>
          <div className="space-y-2">
            {topFolders.map((entry) => (
              <button
                key={entry.name}
                onClick={() => setSelectedTopFolder(entry.name)}
                className={`flex w-full items-center justify-between rounded-2xl px-3 py-2 text-sm transition ${
                  selectedTopFolder === entry.name
                    ? "bg-white shadow-neuSoft"
                    : "bg-white/70 hover:bg-white"
                }`}
              >
                <span>{entry.name}</span>
                <span className="rounded-full bg-mist px-2 py-0.5 text-xs text-ink/60">
                  {entry.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 rounded-[1.5rem] border border-white/70 bg-white/45 p-3 shadow-neuInset">
          <p className="mb-3 text-sm font-medium text-ink/75">Tags</p>
          <div className="flex max-h-[28rem] flex-wrap gap-2 overflow-auto pr-1">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-3 py-2 text-xs transition ${
                  selectedCategory === category
                    ? "bg-white shadow-neuSoft"
                    : "border border-white/70 bg-white/55 hover:bg-white"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </>
    )}
  </div>

  {hasOverflow && (
	<div
	  className={`pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/75 to-transparent transition-opacity duration-300 ${
		hasOverflow ? "opacity-100" : "opacity-0"
	  }`}
	/>
  )}
</aside>

    <section className="rounded-[2rem] border border-white/60 glass-panel p-4 shadow-neu sm:p-5">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mt-1 text-sm text-ink/65">
            {filteredIdeas.length} visible of {initialData.count} ideas
          </p>
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(175px,1fr))] gap-3">
        {filteredIdeas.map((idea) => (
          <button
            key={idea.id}
            onClick={() => openIdea(idea)}
            className="group aspect-square rounded-[1.7rem] border border-white/70 bg-white/60 p-4 text-left shadow-neuSoft transition hover:-translate-y-0.5 hover:bg-white"
          >
            <div className="flex h-full flex-col">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-ink/45">
                  {idea.categoryTrail[idea.categoryTrail.length - 1] ?? "Idea"}
                </p>
                <h3 className="mt-3 line-clamp-4 text-base font-semibold leading-6 tracking-[0.06em] text-ink sm:text-lg">
                  {idea.title}
                </h3>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  </section>
)}
      </div>

      {visibleIdea && (
        <div
		onClick={closeIdea}
		  className={`fixed inset-0 z-50 flex items-end justify-center bg-ink/25 p-0 backdrop-blur-[8px] sm:items-center sm:p-6 transition-opacity duration-100 ${
			isModalOpen ? "opacity-100" : "opacity-0"
		  }`}
		>
		  <div
			ref={dialogRef}
			onClick={(e) => e.stopPropagation()}
			className={`glass-panel relative max-h-[92vh] w-full max-w-4xl overflow-auto rounded-t-[2rem] border border-white/70 p-5 shadow-neu sm:rounded-[2rem] sm:p-8 transform transition-all duration-100 ${
			  isModalOpen
				? "translate-y-0 scale-100 opacity-100"
				: "translate-y-6 scale-[0.98] opacity-0"
			}`}
		  >
    <div className="mb-5 flex items-start justify-between gap-4">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-ink/65">
          {visibleIdea.categoryTrail.join(" / ")}
        </p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                  {visibleIdea.title}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleShare(visibleIdea)}
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/70 bg-white/70 px-3 py-2 text-sm shadow-neuSoft transition hover:bg-white"
                >
                  <Share2 className="h-4 w-4" />
                  {copied ? "Copied" : "Share"}
                </button>
                <button
                  onClick={closeIdea}
                  className="rounded-2xl border border-white/70 bg-white/70 p-2 shadow-neuSoft transition hover:bg-white"
                  aria-label="Close idea"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <section className="space-y-6">
              <div className="rounded-[1.75rem] border border-white/70 bg-white/75 p-5 shadow-neuSoft">
                <p className="text-lg leading-8 text-ink/88 sm:text-xl">
                  {visibleIdea.content.coreIdea}
                </p>
              </div>

              <div className="rounded-[1.75rem] border border-white/70 bg-white/75 p-5 shadow-neuSoft">
                <div className="whitespace-pre-wrap leading-8 text-ink/84">
                  {visibleIdea.content.structure}
                </div>
              </div>

              <blockquote className="rounded-[1.75rem] border border-white/70 bg-white/75 p-5 italic shadow-neuSoft">
                <p className="whitespace-pre-wrap text-lg leading-8 text-ink/86">
                  “{visibleIdea.content.humanSignal}”
                </p>
              </blockquote>
            </section>
          </div>
        </div>
      )}
    </main>
  );
}

function InfoCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-[2rem] border border-white/60 glass-panel p-5 shadow-neu">
      <div className="mb-3 inline-flex rounded-2xl border border-white/70 bg-white/65 p-3 shadow-neuSoft">
        {icon}
      </div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-2 leading-7 text-ink/74">{body}</p>
    </div>
  );
}

function MiniPanel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[1.6rem] border border-white/60 bg-white/62 p-4 shadow-neuSoft">
      <h4 className="text-base font-semibold">{title}</h4>
      <p className="mt-2 text-sm leading-7 text-ink/72">{children}</p>
    </div>
  );
}

function SoftButton({ children }: { children: React.ReactNode }) {
  return (
    <button className="rounded-[1.25rem] border border-white/70 bg-white/72 px-4 py-3 text-left shadow-neuSoft transition hover:bg-white">
      {children}
    </button>
  );
}