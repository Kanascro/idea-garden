"use client";

import { Sparkles } from "lucide-react";
import type { HomeSection } from "../IdeaVaultApp";

type Props = {
    homeSection: HomeSection;
    onChangeSection: (section: HomeSection) => void;
};

export function HomeHeader({ homeSection, onChangeSection }: Props) {
    return (
        <header className="rounded-[2rem] border bg-aura p-6 shadow-neu sm:p-8" style={{ borderColor: "var(--panel-border)" }}>
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-3xl">
                    <p className="theme-panel-strong theme-text mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm shadow-neuSoft">
                        <Sparkles className="h-4 w-4" />
                        Public, free, remixable ideas
                    </p>

                    <h1 className="theme-text text-4xl font-semibold tracking-[0.08em] sm:text-5xl">
                        Marianne&apos;s idea garden
                    </h1>

                    <p className="theme-text-soft mt-3 max-w-2xl text-base leading-7 sm:text-lg">
                        A free garden of ideas, structures, and paradigms.
                    </p>
                </div>

                <div className="theme-panel grid grid-cols-3 gap-3 rounded-[1.5rem] p-2 shadow-neuSoft">
                    <button
                        onClick={() => onChangeSection("about")}
                        className={`theme-text rounded-[1.15rem] px-4 py-3 text-sm font-medium transition ${homeSection === "about"
                            ? "theme-panel-strong shadow-neuSoft"
                            : "hover:bg-[var(--surface-strong)]"
                            }`}
                    >
                        About
                    </button>

                    <button
                        onClick={() => onChangeSection("ideas")}
                        className={`theme-text rounded-[1.15rem] px-4 py-3 text-sm font-medium transition ${homeSection === "ideas"
                            ? "theme-panel-strong shadow-neuSoft"
                            : "hover:bg-[var(--surface-strong)]"
                            }`}
                    >
                        Ideas
                    </button>

                    <button
                        onClick={() => onChangeSection("uses")}
                        className={`theme-text rounded-[1.15rem] px-4 py-3 text-sm font-medium transition ${homeSection === "uses"
                            ? "theme-panel-strong shadow-neuSoft"
                            : "hover:bg-[var(--surface-strong)]"
                            }`}
                    >
                        Uses
                    </button>
                </div>
            </div>
        </header>
    );
}