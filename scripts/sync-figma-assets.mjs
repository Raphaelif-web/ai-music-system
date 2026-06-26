import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const assetsDir = path.join(root, "src/assets/figma");
const srcDir = path.join(root, "src");

const MINIMAL_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64",
);

function collectHashes(dir) {
  const hashes = new Set();

  const walk = (currentDir) => {
    for (const entry of fs.readdirSync(currentDir, { withFileTypes: true })) {
      const entryPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name !== "node_modules") walk(entryPath);
        continue;
      }
      if (!/\.(tsx?|jsx?)$/.test(entry.name)) continue;

      const content = fs.readFileSync(entryPath, "utf8");
      for (const match of content.matchAll(
        /(?:figma:asset\/|@\/assets\/figma\/)([a-f0-9]+\.png)/g,
      )) {
        hashes.add(match[1]);
      }
    }
  };

  walk(dir);
  return [...hashes];
}

async function downloadPlaceholder(filename) {
  const seed = filename.replace(".png", "").slice(0, 16);

  try {
    const response = await fetch(`https://picsum.photos/seed/${seed}/512/512`, {
      redirect: "follow",
    });
    if (!response.ok) throw new Error(response.statusText);
    return Buffer.from(await response.arrayBuffer());
  } catch {
    return MINIMAL_PNG;
  }
}

async function main() {
  fs.mkdirSync(assetsDir, { recursive: true });
  const hashes = collectHashes(srcDir);
  console.log(`Found ${hashes.length} unique figma assets`);

  for (const file of hashes) {
    const outputPath = path.join(assetsDir, file);
    if (fs.existsSync(outputPath)) {
      console.log(`skip ${file}`);
      continue;
    }

    const buffer = await downloadPlaceholder(file);
    fs.writeFileSync(outputPath, buffer);
    console.log(`wrote ${file}`);
    await new Promise((resolve) => setTimeout(resolve, 80));
  }

  const placeholderPath = path.join(assetsDir, "_placeholder.png");
  if (!fs.existsSync(placeholderPath)) {
    fs.writeFileSync(placeholderPath, MINIMAL_PNG);
    console.log("wrote _placeholder.png");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
