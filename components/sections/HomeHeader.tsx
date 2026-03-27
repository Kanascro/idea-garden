"use client";

import { Sparkles } from "lucide-react";
import type { HomeSection } from "../IdeaVaultApp";

type Props = {
    homeSection: HomeSection;
    onChangeSection: (section: HomeSection) => void;
};

export function HomeHeader({ homeSection, onChangeSection }: Props) {
    return (
        <header className="rounded-[2rem] border border-white/50 bg-aura p-6 shadow-neu sm:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-3xl">
                    <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/50 px-3 py-1 text-sm shadow-neuSoft">
                        <Sparkles className="h-4 w-4" />
                        Public, free, remixable ideas
                    </p>

                    <h1 className="text-4xl font-semibold tracking-[0.08em] sm:text-5xl">
                        Marianne&apos;s idea garden
                    </h1>

                    <p className="mt-3 max-w-2xl text-base leading-7 text-ink/75 sm:text-lg">
                        A free garden of ideas, structures, and paradigms.
                    </p>
                </div>

                <div className="grid grid-cols-3 gap-3 rounded-[1.5rem] border border-white/70 bg-white/45 p-2 shadow-neuSoft">
                    <button
                        onClick={() => onChangeSection("about")}
                        className={`rounded-[1.15rem] px-4 py-3 text-sm font-medium transition ${homeSection === "about" ? "bg-white shadow-neuSoft" : "hover:bg-white/50"
                            }`}
                    >
                        About
                    </button>

                    <button
                        onClick={() => onChangeSection("ideas")}
                        className={`rounded-[1.15rem] px-4 py-3 text-sm font-medium transition ${homeSection === "ideas" ? "bg-white shadow-neuSoft" : "hover:bg-white/50"
                            }`}
                    >
                        Ideas
                    </button>

                    <button
                        onClick={() => onChangeSection("uses")}
                        className={`rounded-[1.15rem] px-4 py-3 text-sm font-medium transition ${homeSection === "uses" ? "bg-white shadow-neuSoft" : "hover:bg-white/50"
                            }`}
                    >
                        Uses
                    </button>
                </div>
            </div>
        </header>
    );
}