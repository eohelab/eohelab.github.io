import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

const root = new URL("../", import.meta.url);

test("homepage has production and responsive essentials", async () => {
  const [html, css] = await Promise.all([
    readFile(new URL("index.html", root), "utf8"),
    readFile(new URL("styles.css", root), "utf8"),
  ]);

  assert.match(html, /<meta name="viewport"/i);
  assert.match(html, /content\/site-content\.js[\s\S]*script\.js/);
  assert.doesNotMatch(html, /&lt;\/?span/i);
  assert.match(css, /@media\(max-width:760px\)/);
  assert.match(css, /@media\(max-width:430px\)/);
});

test("news content is centralized and reverse chronological", async () => {
  const source = await readFile(new URL("content/site-content.js", root), "utf8");
  const context = { window: {} };
  vm.runInNewContext(source, context);
  const news = context.window.EOHE_CONTENT.news;

  assert.ok(news.length >= 2);
  assert.deepEqual(
    news.map((item) => item.date),
    news.map((item) => item.date).slice().sort().reverse(),
  );
  for (const item of news) {
    assert.ok(item.zh?.title && item.en?.title && item.href);
    await access(new URL(item.href, root));
  }
});

test("production build contains the Sites worker and synchronized homepage", async () => {
  await Promise.all([
    access(new URL("dist/server/index.js", root)),
    access(new URL("dist/client/eohe-home.html", root)),
    access(new URL("dist/.openai/hosting.json", root)),
  ]);
});
