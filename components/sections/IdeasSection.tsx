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

    const frame = requestAnimationFrame(check);

    const el = asideRef.current;
    if (el) el.addEventListener("scroll", check);
    window.addEventListener("resize", check);

    return () => {
      cancelAnimationFrame(frame);
      if (el) el.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [
    filtersOpen,
    query,
    selectedTopFolder,
    selectedCategory,
    categories.length,
    topFolders.length,
  ]);

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
        className={`glass-panel relative self-start overflow-hidden rounded-[2rem] px-3 pt-2 shadow-neu lg:sticky lg:top-4 ${filtersOpen ? "pb-3" : "pb-2"
          } lg:p-4`}
      >
        <div
          ref={asideRef}
          className="lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto no-scrollbar"
        >
          <button
            onClick={() => setFiltersOpen((v) => !v)}
            className={`${filtersOpen ? "mb-2" : "mb-0"} theme-text flex w-full items-center justify-between px-2 py-2 text-left text-sm font-medium lg:hidden`}
            aria-expanded={filtersOpen}
            aria-controls="ideas-filters-panel"
          >
            <span>Filters</span>
            <span className="theme-text-soft text-xl leading-none">{filtersOpen ? "−" : "+"}</span>
          </button>
          {filtersOpen && (
            <div id="ideas-filters-panel" className="mt-3 space-y-4">
              <div className="theme-panel rounded-[1.5rem] p-3 shadow-neuInset">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label className="theme-text-soft flex items-center gap-2 mb-3 text-sm font-medium">
                    <Search className="h-4 w-4" />
                    Search
                  </label>
                </div>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Title, content..."
                  className="theme-text w-full rounded-2xl border bg-[var(--surface-strong)] px-4 py-3 text-sm outline-none ring-0 placeholder:text-[color:var(--text-faint)] focus:ring-2 focus:ring-[var(--accent-border)]"
                  style={{ borderColor: "var(--panel-border)" }}
                />
              </div>
              <div className="theme-panel rounded-[1.5rem] p-3 shadow-neuInset">
                <p className="theme-text-soft mb-3 text-sm font-medium">Categories</p>
                <div className="space-y-2">
                  {topFolders.map((entry) => (
                    <button
                      key={entry.name}
                      onClick={() => setSelectedTopFolder(entry.name)}
                      className={`flex w-full items-center justify-between rounded-2xl border px-3 py-2 text-sm transition ${selectedTopFolder === entry.name
                        ? "theme-accent shadow-neuInset ring-1 ring-[var(--accent-border)]"
                        : "theme-panel-strong theme-text hover:bg-[var(--surface-strong)]"
                        }`}
                      style={{
                        borderColor:
                          selectedTopFolder === entry.name
                            ? "var(--accent-border)"
                            : "var(--panel-border)",
                      }}
                    >
                      <span className="flex items-center gap-2">
                        {entry.name}
                      </span>

                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${selectedTopFolder === entry.name
                          ? "theme-accent-strong"
                          : "theme-panel-soft theme-text-soft"
                          }`}
                      >
                        {entry.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="theme-panel rounded-[1.5rem] p-3 shadow-neuInset">
                <p className="theme-text-soft mb-3 text-sm font-medium">Tags</p>
                <div className="flex flex-wrap gap-2 pr-1">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`rounded-full border px-3 py-2 text-xs font-medium transition ${selectedCategory === category
                        ? "theme-accent shadow-neuInset ring-1 ring-[var(--accent-border)]"
                        : "theme-panel-strong theme-text hover:bg-[var(--surface-strong)]"
                        }`}
                      style={{
                        borderColor:
                          selectedCategory === category
                            ? "var(--accent-border)"
                            : "var(--panel-border)",
                      }}
                    >
                      <span className="flex items-center gap-1.5">
                        {category}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div
          className={`pointer-events-none absolute bottom-0 left-0 right-0 h-32 transition-opacity duration-300 ${hasOverflow ? "opacity-100" : "opacity-0"
            }`}
          style={{
            background: "linear-gradient(to top, var(--surface-strong), transparent)",
          }}
        />
      </aside>

      <section className="glass-panel rounded-[2rem] p-4 shadow-neu sm:p-5">
        <p className="theme-text-soft mb-4 text-sm">
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
              className={`theme-panel-strong group flex aspect-[0.92] flex-col justify-start rounded-[1.6rem] border p-5 text-left shadow-neuSoft transition hover:-translate-y-0.5 hover:bg-[var(--surface-strong)] sm:aspect-square sm:p-4 ${newlyAddedIds.includes(idea.id) ? "animate-idea-in" : ""
                }`}
              style={{ borderColor: "var(--panel-border)" }}
            >
              <p className="text-xs uppercase tracking-[0.18em] theme-text-faint">
                {idea.categoryTrail[idea.categoryTrail.length - 1] ?? "Idea"}
              </p>

              <h3 className="theme-text mt-3 line-clamp-4 text-base font-semibold leading-6 tracking-[0.06em] sm:text-lg">
                {idea.title}
              </h3>
            </button>
          ))}

          {hasMoreIdeas && (
            <button
              key="more-card"
              onClick={showMoreIdeas}
              className="group flex aspect-[0.92] flex-col items-center justify-center rounded-[1.6rem] border p-5 text-center shadow-neuSoft transition hover:-translate-y-0.5 hover:shadow-neu sm:aspect-square sm:p-4"
              style={{
                borderColor: "var(--panel-border)",
                background: "linear-gradient(145deg, var(--surface-strong), var(--surface-soft))",
              }}
              aria-label="Load more ideas"
            >
              <h3 className="theme-text mt-3 line-clamp-4 text-base font-semibold leading-6 tracking-[0.06em] sm:text-lg">
                Show more...
              </h3>
            </button>
          )}
        </div>
      </section>
    </section>
  );
}