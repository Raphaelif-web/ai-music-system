import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.resolve(__dirname, "../src");

const FIGMA_IMPORT =
  /from\s+["']figma:asset\/([a-f0-9]+\.png)["']/g;

function migrateFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  if (!content.includes("figma:asset/")) return false;

  const migrated = content.replace(
    FIGMA_IMPORT,
    'from "@/assets/figma/$1"',
  );

  if (migrated === content) return false;

  fs.writeFileSync(filePath, migrated, "utf8");
  return true;
}

function walk(dir) {
  let count = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      count += walk(entryPath);
      continue;
    }
    if (!/\.(tsx?|jsx?)$/.test(entry.name)) continue;
    if (migrateFile(entryPath)) {
      console.log(`migrated ${path.relative(srcDir, entryPath)}`);
      count += 1;
    }
  }
  return count;
}

const total = walk(srcDir);
console.log(`Done. ${total} file(s) updated.`);
