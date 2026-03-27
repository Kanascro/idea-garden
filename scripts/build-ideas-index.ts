import fs from "node:fs";
import path from "node:path";
import { loadIdeasFromVault } from "../lib/idea-loader";

const outPath = path.join(process.cwd(), "public", "ideas-index.json");

function main() {
  const index = loadIdeasFromVault();
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(index, null, 2), "utf8");
  console.log(`Built ideas index with ${index.count} ideas → ${outPath}`);
}

main();