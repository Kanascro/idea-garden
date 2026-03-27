import fs from "node:fs";
import path from "node:path";
import type { IdeaIndex, IdeaItem } from "./types";

const VAULT_ROOT = path.join(process.cwd(), "vault");
const EXCLUDED_DIRS = new Set([".obsidian", "_Artefacts"]);
const INCLUDED_EXTENSIONS = new Set([".md"]);

function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function parseSections(markdown: string) {
  const headings = [
    { label: "Core idea", key: "coreIdea" as const },
    { label: "Structure", key: "structure" as const },
    { label: "Human signal", key: "humanSignal" as const },
  ];

  const lines = markdown.split(/\r?\n/);
  const result = {
    coreIdea: "",
    structure: "",
    humanSignal: "",
  };

  let current: keyof typeof result | null = null;

  for (const line of lines) {
    const match = line.match(/^##\s+(.*)$/i);
    if (match) {
      const heading = match[1].trim().toLowerCase();
      const found = headings.find((h) => h.label.toLowerCase() === heading);
      current = found?.key ?? null;
      continue;
    }

    if (current) {
      result[current] += (result[current] ? "\n" : "") + line;
    }
  }

  return {
    coreIdea: result.coreIdea.trim(),
    structure: result.structure.trim(),
    humanSignal: result.humanSignal.trim(),
  };
}

function collectMarkdownFiles(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (EXCLUDED_DIRS.has(entry.name)) continue;
      files.push(...collectMarkdownFiles(path.join(dir, entry.name)));
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (!INCLUDED_EXTENSIONS.has(ext)) continue;
      files.push(path.join(dir, entry.name));
    }
  }

  return files;
}

export function loadIdeasFromVault(): IdeaIndex {
  const files = collectMarkdownFiles(VAULT_ROOT);

  const ideas: IdeaItem[] = files.map((filePath) => {
    const rel = path.relative(VAULT_ROOT, filePath);
    const relParts = rel.split(path.sep);
    const fileName = relParts[relParts.length - 1];
    const title = fileName.replace(/\.md$/i, "");
    const folderParts = relParts.slice(0, -1);
    const raw = fs.readFileSync(filePath, "utf8");
    const content = parseSections(raw);
    const slugBase = [...folderParts, title].map(slugify).join("/");

    return {
      id: slugBase,
      slug: slugBase,
      title,
      path: relParts,
      categoryTrail: folderParts,
      categoryKey: folderParts.join(" / ") || "Uncategorized",
      content,
      raw,
    };
  });

  ideas.sort((a, b) => a.title.localeCompare(b.title));

  return {
    generatedAt: new Date().toISOString(),
    count: ideas.length,
    ideas,
  };
}