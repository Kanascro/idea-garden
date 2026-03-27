"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import type { IdeaItem } from "../../lib/types";
import { useIdeaSearch, ALL_FILTER } from "./hooks/useIdeaSearch";
import { useResponsiveFilters } from "./hooks/useResponsiveFilters";

const UNCATEGORIZED = "Uncategorized";

type Props = {
  ideas: IdeaItem[];
  onOpenIdea: (idea: IdeaItem) => void;
};

function normalize(value: string) {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function buildSearchText(idea: IdeaItem) {
  return normalize(
    [
      idea.title,
      idea.categoryTrail.join(" "),
      idea.content.coreIdea,
      idea.content.structure,
      idea.content.humanSignal,
    ].join(" ")
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

  return score;
}

export function IdeasSection({ ideas, onOpenIdea }: Props) {
  const [query, setQuery] = useState("");
  const { filtersOpen, setFiltersOpen } = useResponsiveFilters();
  const [hasOverflow, setHasOverflow] = useState(false);
  const asideRef = useRef<HTMLDivElement | null>(null);

  const [selectedTopFolder, setSelectedTopFolder] = useState(ALL_FILTER);
  const [selectedCategory, setSelectedCategory] = useState(ALL_FILTER);

  const { topFolders, categories, filteredIdeas } = useIdeaSearch({
    ideas,
    query,
    selectedTopFolder,
    selectedCategory,
  });

  useEffect(() => {
    setSelectedCategory(ALL_FILTER);
  }, [selectedTopFolder]);

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
    if (el) el.addEventListener("scroll", check);
    window.addEventListener("resize", check);

    return () => {
      if (el) el.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [filtersOpen]);

  return (
    <section className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="relative overflow-hidden rounded-[2rem] border border-white/60 glass-panel p-4 shadow-neu lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)]">
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
                      className={`flex w-full items-center justify-between rounded-2xl px-3 py-2 text-sm transition ${selectedTopFolder === entry.name
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
                      className={`rounded-full px-3 py-2 text-xs transition ${selectedCategory === category
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

        <div
          className={`pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/75 to-transparent transition-opacity duration-300 ${hasOverflow ? "opacity-100" : "opacity-0"
            }`}
        />
      </aside>

      <section className="rounded-[2rem] border border-white/60 glass-panel p-4 shadow-neu sm:p-5">
        <p className="mb-4 text-sm text-ink/65">
          {filteredIdeas.length} visible of {ideas.length} ideas
        </p>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(175px,1fr))] gap-3">
          {filteredIdeas.map((idea) => (
            <button
              key={idea.id}
              onClick={() => onOpenIdea(idea)}
              className="group aspect-square rounded-[1.7rem] border border-white/70 bg-white/60 p-4 text-left shadow-neuSoft transition hover:-translate-y-0.5 hover:bg-white"
            >
              <p className="text-xs uppercase tracking-[0.18em] text-ink/45">
                {idea.categoryTrail[idea.categoryTrail.length - 1] ?? "Idea"}
              </p>

              <h3 className="mt-3 line-clamp-4 text-base font-semibold leading-6 tracking-[0.06em] text-ink sm:text-lg">
                {idea.title}
              </h3>
            </button>
          ))}
        </div>
      </section>
    </section>
  );
}