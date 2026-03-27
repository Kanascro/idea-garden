"use client";

import { useEffect, useState } from "react";
import { Share2, X } from "lucide-react";
import type { IdeaIndex, IdeaItem } from "../lib/types";
import { HomeHeader } from "./sections/HomeHeader";
import { AboutSection } from "./sections/AboutSection";
import { UsesSection } from "./sections/UsesSection";
import { IdeasSection } from "./sections/IdeasSection";
import { ALL_FILTER } from "./sections/hooks/useIdeaSearch";
import { SiteFooter } from "./sections/SiteFooter";

type Props = {
  initialData: IdeaIndex;
};

export type HomeSection = "about" | "ideas" | "uses";

function shuffleIdeas<T>(items: T[]) {
  const next = [...items];

  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }

  return next;
}

export default function IdeaVaultApp({ initialData }: Props) {
  const [homeSection, setHomeSection] = useState<HomeSection>("ideas");
  const [visibleIdea, setVisibleIdea] = useState<IdeaItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedTopFolder, setSelectedTopFolder] = useState(ALL_FILTER);
  const [selectedCategory, setSelectedCategory] = useState(ALL_FILTER);
  const [theme, setTheme] = useState<"light" | "dark" | "rainbow">("light");
  const [shuffledIdeas] = useState(() => shuffleIdeas(initialData.ideas));

  useEffect(() => {
    const hash = decodeURIComponent(window.location.hash.replace(/^#/, ""));
    if (!hash) return;

    const found = shuffledIdeas.find((idea) => idea.slug === hash);
    if (found) {
      setVisibleIdea(found);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsModalOpen(true);
        });
      });
    }
  }, [shuffledIdeas]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeIdea();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!visibleIdea) return;
    window.history.replaceState(
      null,
      "",
      `#${encodeURIComponent(visibleIdea.slug)}`
    );
    setCopied(false);
  }, [visibleIdea]);

  useEffect(() => {
    if (!visibleIdea && window.location.hash) {
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search
      );
    }
  }, [visibleIdea]);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
  }, [theme]);

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
    window.setTimeout(() => {
      setVisibleIdea(null);
    }, 200);
  }

  async function handleShare(idea: IdeaItem) {
    const url = `${window.location.origin}${window.location.pathname}#${encodeURIComponent(
      idea.slug
    )}`;

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

  function openIdeasWithTrail(trail: string[], index: number) {
    const topFolder = trail[0] ?? ALL_FILTER;
    const categoryPrefix =
      index <= 0 ? ALL_FILTER : trail.slice(1, index + 1).join(" / ");

    setHomeSection("ideas");
    setQuery("");
    setSelectedTopFolder(topFolder);
    setSelectedCategory(categoryPrefix);

    setIsModalOpen(false);
    window.setTimeout(() => {
      setVisibleIdea(null);
      requestAnimationFrame(() => {
        const ideasSection = document.getElementById("ideas-section");
        ideasSection?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }, 200);
  }

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <HomeHeader
          homeSection={homeSection}
          onChangeSection={setHomeSection}
        />

        {homeSection === "about" && <AboutSection />}
        {homeSection === "uses" && <UsesSection />}
        {homeSection === "ideas" && (
          <IdeasSection
            ideas={shuffledIdeas}
            onOpenIdea={openIdea}
            query={query}
            setQuery={setQuery}
            selectedTopFolder={selectedTopFolder}
            setSelectedTopFolder={setSelectedTopFolder}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        )}
        <SiteFooter theme={theme} onThemeChange={setTheme} />
      </div>

      {visibleIdea && (
        <div
          onClick={closeIdea}
          className={`fixed inset-0 z-50 flex items-start justify-center bg-ink/25 p-0 backdrop-blur-[8px] transition-opacity duration-200 sm:items-center sm:p-6 ${isModalOpen ? "opacity-100" : "opacity-0"
            }`}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`glass-panel relative max-h-[100dvh] w-full overflow-auto overscroll-contain rounded-none px-5 pb-6 pt-6 shadow-none transition-all duration-200 sm:max-h-[92vh] sm:max-w-4xl sm:rounded-[2rem] border border-white/70 sm:p-8 sm:shadow-neu ${isModalOpen
              ? "translate-y-0 scale-100 opacity-100"
              : "translate-y-6 scale-[0.98] opacity-0"
              }`}
          >
            <div className="mb-6 relative">
              {/* Mobile header */}
              <div className="sm:hidden">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.72rem] uppercase tracking-[0.24em] text-ink/65">
                    {visibleIdea.categoryTrail.map((segment, index) => (
                      <span key={`${segment}-${index}`} className="flex items-center gap-x-2">
                        <button
                          type="button"
                          onClick={() => openIdeasWithTrail(visibleIdea.categoryTrail, index)}
                          className="uppercase transition hover:text-ink"
                        >
                          {segment}
                        </button>
                        {index < visibleIdea.categoryTrail.length - 1 && <span>/</span>}
                      </span>
                    ))}
                  </div>

                  <h2 className="mt-2 pr-12 text-[2.2rem] font-semibold leading-[1.02] tracking-tight">
                    {visibleIdea.title}
                  </h2>
                </div>

                {/* X (mobile only) */}
                <button
                  onClick={closeIdea}
                  className="absolute right-2 top-2 rounded-2xl border border-white/70 bg-white/70 p-2 shadow-neuSoft transition hover:bg-white"
                  aria-label="Close idea"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Desktop header */}
              <div className="hidden sm:flex sm:items-start sm:justify-between sm:gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs uppercase tracking-[0.2em] text-ink/65">
                    {visibleIdea.categoryTrail.map((segment, index) => (
                      <span key={`${segment}-${index}`} className="flex items-center gap-x-2">
                        <button
                          type="button"
                          onClick={() => openIdeasWithTrail(visibleIdea.categoryTrail, index)}
                          className="uppercase transition hover:text-ink"
                        >
                          {segment}
                        </button>
                        {index < visibleIdea.categoryTrail.length - 1 && <span>/</span>}
                      </span>
                    ))}
                  </div>

                  <h2 className="mt-2 text-4xl font-semibold leading-[0.95] tracking-tight">
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

            {/* Mobile-only Share (kept at bottom) */}
            <div className="mt-4 flex justify-end sm:hidden">
              <button
                onClick={() => handleShare(visibleIdea)}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/70 bg-white/70 px-3 py-2 text-sm shadow-neuSoft transition hover:bg-white"
              >
                <Share2 className="h-4 w-4" />
                {copied ? "Copied" : "Share"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}