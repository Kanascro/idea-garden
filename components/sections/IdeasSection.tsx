"use client";

import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import type { IdeaItem } from "../../lib/types";
import { useIdeaSearch, ALL_FILTER } from "./hooks/useIdeaSearch";
import { useResponsiveFilters } from "./hooks/useResponsiveFilters";

type Props = {
  ideas: IdeaItem[];
  onOpenIdea: (idea: IdeaItem) => void;
  query: string;
  setQuery: (value: string) => void;
  selectedTopFolder: string;
  setSelectedTopFolder: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
};

export function IdeasSection({
  ideas,
  onOpenIdea,
  query,
  setQuery,
  selectedTopFolder,
  setSelectedTopFolder,
  selectedCategory,
  setSelectedCategory,
}: Props) {
  const { filtersOpen, setFiltersOpen } = useResponsiveFilters();
  const [hasOverflow, setHasOverflow] = useState(false);
  const asideRef = useRef<HTMLDivElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const [columnsPerBatch, setColumnsPerBatch] = useState<number | null>(null);
  const INITIAL_ROWS = 6;
  const MORE_ROWS = 3;
  const [visibleCount, setVisibleCount] = useState(0);
  const [newlyAddedIds, setNewlyAddedIds] = useState<string[]>([]);

  const { topFolders, categories, filteredIdeas } = useIdeaSearch({
    ideas,
    query,
    selectedTopFolder,
    selectedCategory,
  });
  const initialBatchSize =
    columnsPerBatch === null ? 0 : Math.max(columnsPerBatch * INITIAL_ROWS, 1);

  const moreBatchSize =
    columnsPerBatch === null ? 0 : Math.max(columnsPerBatch * MORE_ROWS, 1);

  const hasMoreIdeas = visibleCount < filteredIdeas.length;
  const visibleIdeaCount = hasMoreIdeas
    ? Math.max(visibleCount - 1, 0)
    : visibleCount;
  const visibleIdeas = filteredIdeas.slice(0, visibleIdeaCount);

  useEffect(() => {
    setSelectedCategory(ALL_FILTER);
  }, [selectedTopFolder]);

  useEffect(() => {
    if (initialBatchSize === 0) return;
    setVisibleCount(initialBatchSize);
  }, [query, selectedTopFolder, selectedCategory, initialBatchSize]);

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

  useEffect(() => {
    setNewlyAddedIds([]);
  }, [query, selectedTopFolder, selectedCategory]);

  useEffect(() => {
    function measureColumns() {
      const el = gridRef.current;
      if (!el) return;

      const styles = window.getComputedStyle(el);
      const template = styles.gridTemplateColumns;

      if (!template) return;

      const count = template
        .split(" ")
        .map((part) => part.trim())
        .filter(Boolean).length;

      if (count > 0) {
        setColumnsPerBatch(count);
      }
    }

    measureColumns();

    const el = gridRef.current;
    if (!el) return;

    const observer = new ResizeObserver(() => {
      measureColumns();
    });

    observer.observe(el);
    window.addEventListener("resize", measureColumns);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measureColumns);
    };
  }, []);

  useEffect(() => {
    setNewlyAddedIds([]);
  }, [query, selectedTopFolder, selectedCategory]);

  function showMoreIdeas() {
    if (moreBatchSize === 0) return;
    const nextVisibleCount = Math.min(
      visibleCount + moreBatchSize,
      filteredIdeas.length
    );

    const nextHasMoreIdeas = nextVisibleCount < filteredIdeas.length;
    const nextVisibleIdeaCount = nextHasMoreIdeas
      ? Math.max(nextVisibleCount - 1, 0)
      : nextVisibleCount;

    const nextVisibleIdeas = filteredIdeas.slice(0, nextVisibleIdeaCount);
    const currentIds = new Set(visibleIdeas.map((idea) => idea.id));
    const addedIds = nextVisibleIdeas
      .filter((idea) => !currentIds.has(idea.id))
      .map((idea) => idea.id);

    setNewlyAddedIds(addedIds);
    setVisibleCount(nextVisibleCount);

    window.setTimeout(() => {
      setNewlyAddedIds([]);
    }, 260);
  }

  return (
    <section
      id="ideas-section"
      className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]"
    >
      <aside
        className={`relative overflow-hidden rounded-[2rem] border border-white/60 glass-panel px-3 pt-2 shadow-neu lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] ${filtersOpen ? "pb-3" : "pb-2"
          } lg:p-4`}
      >
        <div
          ref={asideRef}
          className="lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto no-scrollbar"
        >
          <button
            onClick={() => setFiltersOpen((v) => !v)}
            className={`${filtersOpen ? "mb-2" : "mb-0"} flex w-full items-center justify-between px-2 py-2 text-left text-sm font-medium lg:hidden`}
            aria-expanded={filtersOpen}
            aria-controls="ideas-filters-panel"
          >
            <span>Filters</span>
            <span className="text-xl leading-none">{filtersOpen ? "−" : "+"}</span>
          </button>
          {filtersOpen && (
            <div id="ideas-filters-panel" className="mt-3 space-y-4">
              <div className="rounded-[1.5rem] border border-white/70 bg-white/45 p-3 shadow-neuInset">
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-ink/75">
                  <Search className="h-4 w-4" />
                  Search
                </label>

                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Title, content..."
                  className="w-full rounded-2xl border border-white/70 bg-white px-4 py-3 text-sm outline-none ring-0 placeholder:text-ink/40"
                />
              </div>

              <div className="rounded-[1.5rem] border border-white/70 bg-white/45 p-3 shadow-neuInset">
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

              <div className="rounded-[1.5rem] border border-white/70 bg-white/45 p-3 shadow-neuInset">
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
            </div>
          )}
        </div>

        <div
          className={`pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/75 to-transparent transition-opacity duration-300 ${hasOverflow ? "opacity-100" : "opacity-0"
            }`}
        />
      </aside>

      <section className="rounded-[2rem] border border-white/60 glass-panel p-4 shadow-neu sm:p-5">
        <p className="mb-4 text-sm text-ink/65">
          {columnsPerBatch === null
            ? "Loading ideas..."
            : `Showing ${visibleIdeas.length} of ${filteredIdeas.length} matching ideas${filteredIdeas.length !== ideas.length ? ` (${ideas.length} total)` : ""
            }`}
        </p>

        <div
          ref={gridRef}
          className="grid grid-cols-2 gap-3 sm:grid-cols-[repeat(auto-fill,minmax(175px,1fr))]"
        >
          {visibleIdeas.map((idea) => (
            <button
              key={idea.id}
              onClick={() => onOpenIdea(idea)}
              className={`group flex aspect-[0.92] flex-col justify-start rounded-[1.6rem] border border-white/70 bg-white/60 p-5 text-left shadow-neuSoft transition hover:-translate-y-0.5 hover:bg-white sm:aspect-square sm:p-4 ${newlyAddedIds.includes(idea.id) ? "animate-idea-in" : ""
                }`}
            >
              <p className="text-xs uppercase tracking-[0.18em] text-ink/45">
                {idea.categoryTrail[idea.categoryTrail.length - 1] ?? "Idea"}
              </p>

              <h3 className="mt-3 line-clamp-4 text-base font-semibold leading-6 tracking-[0.06em] text-ink sm:text-lg">
                {idea.title}
              </h3>
            </button>
          ))}

          {hasMoreIdeas && (
            <button
              key="more-card"
              onClick={showMoreIdeas}
              className="group flex aspect-[0.92] flex-col items-center justify-center rounded-[1.6rem] border border-white/70 bg-[linear-gradient(145deg,rgba(255,238,244,0.9),rgba(255,245,248,0.85))] p-5 text-center shadow-neuSoft transition hover:-translate-y-0.5 hover:shadow-neu sm:aspect-square sm:p-4"
              aria-label="Load more ideas"
            >
              <h3 className="mt-3 line-clamp-4 text-base font-semibold leading-6 tracking-[0.06em] text-ink sm:text-lg">
                Show more...
              </h3>
            </button>
          )}
        </div>
      </section>
    </section>
  );
}