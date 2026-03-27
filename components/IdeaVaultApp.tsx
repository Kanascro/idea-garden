"use client";

import { useEffect, useState } from "react";
import { Share2, Sparkles, X } from "lucide-react";
import type { IdeaIndex, IdeaItem } from "../lib/types";
import { HomeHeader } from "./sections/HomeHeader";
import { AboutSection } from "./sections/AboutSection";
import { UsesSection } from "./sections/UsesSection";
import { IdeasSection } from "./sections/IdeasSection";

type Props = {
  initialData: IdeaIndex;
};

export type HomeSection = "about" | "ideas" | "uses";

export default function IdeaVaultApp({ initialData }: Props) {
  const [homeSection, setHomeSection] = useState<HomeSection>("ideas");
  const [visibleIdea, setVisibleIdea] = useState<IdeaItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const hash = decodeURIComponent(window.location.hash.replace(/^#/, ""));
    if (!hash) return;

    const found = initialData.ideas.find((idea) => idea.slug === hash);
    if (found) {
      setVisibleIdea(found);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsModalOpen(true);
        });
      });
    }
  }, [initialData.ideas]);

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
          <IdeasSection ideas={initialData.ideas} onOpenIdea={openIdea} />
        )}
      </div>

      {visibleIdea && (
        <div
          onClick={closeIdea}
          className={`fixed inset-0 z-50 flex items-end justify-center bg-ink/25 p-0 backdrop-blur-[8px] sm:items-center sm:p-6 transition-opacity duration-200 ${isModalOpen ? "opacity-100" : "opacity-0"
            }`}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`glass-panel relative max-h-[92vh] w-full max-w-4xl overflow-auto overscroll-contain rounded-t-[2rem] border border-white/70 p-5 shadow-neu sm:rounded-[2rem] sm:p-8 transform transition-all duration-200 ${isModalOpen
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