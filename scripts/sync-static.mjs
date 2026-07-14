import { cp, mkdir, rm } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const publicDir = resolve(root, "public");

const files = [
  ["index.html", "eohe-home.html"],
  ["styles.css", "styles.css"],
  ["visitor-stats.css", "visitor-stats.css"],
  ["script.js", "script.js"],
  ["news-brics-2026.html", "news-brics-2026.html"],
  ["news-egu-2026.html", "news-egu-2026.html"],
  ["research-archive.html", "research-archive.html"],
  ["content/site-content.js", "content/site-content.js"],
];

await mkdir(resolve(publicDir, "content"), { recursive: true });
for (const [source, destination] of files) {
  await cp(resolve(root, source), resolve(publicDir, destination));
}

await rm(resolve(publicDir, "assets"), { recursive: true, force: true });
await cp(resolve(root, "assets"), resolve(publicDir, "assets"), {
  recursive: true,
});

console.log("Static site content synchronized to public/.");
