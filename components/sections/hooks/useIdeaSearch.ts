import { useMemo } from "react";
import type { IdeaItem } from "../../../lib/types";

export const ALL_FILTER = "All";
export const UNCATEGORIZED = "Uncategorized";

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

type Args = {
    ideas: IdeaItem[];
    query: string;
    selectedTopFolder: string;
    selectedCategory: string;
};

export function useIdeaSearch({
    ideas,
    query,
    selectedTopFolder,
    selectedCategory,
}: Args) {
    const topFolders = useMemo(() => {
        const counts = new Map<string, number>();

        for (const idea of ideas) {
            const top = idea.categoryTrail[0] ?? UNCATEGORIZED;
            counts.set(top, (counts.get(top) ?? 0) + 1);
        }

        return [
            { name: ALL_FILTER, count: ideas.length },
            ...Array.from(counts.entries())
                .sort((a, b) => a[0].localeCompare(b[0]))
                .map(([name, count]) => ({ name, count })),
        ];
    }, [ideas]);

    const categories = useMemo(() => {
        const set = new Set<string>();

        for (const idea of ideas) {
            const top = idea.categoryTrail[0] ?? UNCATEGORIZED;
            if (selectedTopFolder !== ALL_FILTER && top !== selectedTopFolder) continue;
            if (idea.categoryTrail.length <= 1) continue;
            set.add(idea.categoryTrail.slice(1).join(" / "));
        }

        return [ALL_FILTER, ...Array.from(set).sort((a, b) => a.localeCompare(b))];
    }, [ideas, selectedTopFolder]);

    const filteredIdeas = useMemo(() => {
        let next = ideas;

        if (selectedTopFolder !== ALL_FILTER) {
            next = next.filter(
                (idea) => (idea.categoryTrail[0] ?? UNCATEGORIZED) === selectedTopFolder
            );
        }

        if (selectedCategory !== ALL_FILTER) {
            next = next.filter(
                (idea) => idea.categoryTrail.slice(1).join(" / ") === selectedCategory
            );
        }

        if (!query.trim()) return next;

        return [...next]
            .map((idea) => ({ idea, score: scoreIdea(idea, query) }))
            .filter((entry) => entry.score > 0)
            .sort((a, b) => b.score - a.score || a.idea.title.localeCompare(b.idea.title))
            .map((entry) => entry.idea);
    }, [ideas, query, selectedCategory, selectedTopFolder]);

    return {
        topFolders,
        categories,
        filteredIdeas,
    };
}