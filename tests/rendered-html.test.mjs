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

test("Chinese public copy identifies a research group, not a standalone lab", async () => {
  const script = await readFile(new URL("script.js", root), "utf8");

  assert.match(script, /navPeople:'课题组成员'/);
  assert.match(script, /peopleEyebrow:'我们的课题组'/);
  assert.match(script, /newsEyebrow:'课题组动态'/);
  assert.match(script, /地球观测与人类环境课题组｜中山大学/);
  assert.match(
    script,
    /地球观测与人类环境课题组 · 中山大学遥感科学与技术学院/,
  );
});

test("visitor overview is responsive and privacy preserving", async () => {
  const [html, css, script] = await Promise.all([
    readFile(new URL("index.html", root), "utf8"),
    readFile(new URL("visitor-stats.css", root), "utf8"),
    readFile(new URL("script.js", root), "utf8"),
  ]);

  assert.match(html, /class="visitor-overview"/);
  assert.match(html, /data-visitor-total/);
  assert.match(html, /data-visitor-locations/);
  assert.match(css, /\.visitor-overview-inner/);
  assert.match(script, /不保存访客 IP 地址/);
  assert.match(script, /visitor-stats-api/);
  assert.doesNotMatch(script, /__VISITOR_STATS_ENDPOINT__/);
  assert.doesNotMatch(script, /localStorage\.setItem\([^,]+,\s*(?:ip|location)/i);
});

test("data-product category labels stay bilingual and use building footprint terminology", async () => {
  const script = await readFile(new URL("script.js", root), "utf8");

  assert.match(script, /'01 \/ 地表覆盖','02 \/ 农业','03 \/ 建筑数据集'/);
  assert.match(script, /'01 \/ LAND COVER','02 \/ AGRICULTURE','03 \/ BUILDING DATASET'/);
  assert.match(script, /泛北极建筑足迹图集/);
  assert.doesNotMatch(script, /建筑轮廓图集/);
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

test("production root serves the static research-group homepage", async () => {
  const workerUrl = new URL("dist/server/index.js", root);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  let requestedPath = null;
  const response = await worker.fetch(
    new Request("https://example.test/"),
    {
      ASSETS: {
        fetch: async (request) => {
          requestedPath = new URL(request.url).pathname;
          return new Response("EOHE", { status: 200 });
        },
      },
    },
    { waitUntil() {}, passThroughOnException() {} },
  );

  assert.equal(response.status, 200);
  assert.equal(await response.text(), "EOHE");
  assert.equal(requestedPath, "/eohe-home.html");
});

test("portable static build is ready for alternate hosting", async () => {
  await Promise.all([
    access(new URL("dist-static/index.html", root)),
    access(new URL("dist-static/content/site-content.js", root)),
    access(new URL("dist-static/visitor-stats.css", root)),
    access(new URL("dist-static/news-brics-2026.html", root)),
    access(new URL("dist-static/assets/liu-chong.jpg", root)),
  ]);
});
