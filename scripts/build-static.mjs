import { cp, mkdir, rm } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const output = resolve(root, "dist-static");

await rm(output, { recursive: true, force: true });
await mkdir(resolve(output, "content"), { recursive: true });

const files = [
  ["index.html", "index.html"],
  ["styles.css", "styles.css"],
  ["visitor-stats.css", "visitor-stats.css"],
  ["script.js", "script.js"],
  ["news-brics-2026.html", "news-brics-2026.html"],
  ["news-egu-2026.html", "news-egu-2026.html"],
  ["research-archive.html", "research-archive.html"],
  ["content/site-content.js", "content/site-content.js"],
];

for (const [source, destination] of files) {
  await cp(resolve(root, source), resolve(output, destination));
}

await cp(resolve(root, "assets"), resolve(output, "assets"), {
  recursive: true,
});

console.log("Portable static website generated in dist-static/.");
