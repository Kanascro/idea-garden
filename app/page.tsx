import fs from "node:fs/promises";
import path from "node:path";
import IdeaVaultApp from "@/components/IdeaVaultApp";
import type { IdeaIndex } from "@/lib/types";

async function getIdeas(): Promise<IdeaIndex> {
  const filePath = path.join(process.cwd(), "public", "ideas-index.json");
  const file = await fs.readFile(filePath, "utf8");
  return JSON.parse(file) as IdeaIndex;
}

export default async function Page() {
  const data = await getIdeas();
  return <IdeaVaultApp initialData={data} />;
}