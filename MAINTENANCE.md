# EOHE Lab website maintenance

This repository keeps the public website content separate from its hosting
adapter. The visible site remains plain HTML, CSS, and JavaScript, so future
updates do not require React or Cloudflare knowledge.

## Common updates

- Latest news: edit `content/site-content.js`, add the newest record at the top,
  and add its detail HTML page in the project root. Images belong in
  `assets/news/`.
- Team members: update the `renderStudents` / `renderPeijie` content in
  `script.js`; place optimized portraits in `assets/`.
- Projects and publications: edit `research-archive.html` for the full archive
  and the selected entries in `index.html` / `script.js` for the homepage.
- Data and products: update the resource cards in `index.html` and their final
  labels/links in `script.js`.
- Shared visual design and mobile breakpoints: edit `styles.css` and the small
  page-specific style blocks in each HTML file.

## Local preview and production build

```sh
pnpm dev
pnpm build
pnpm build:static
```

The `sync:content` step copies the framework-independent site into `public/`
before every preview or build. Treat the root HTML/CSS/JS files, `content/`, and
`assets/` as the source of truth; do not edit generated copies under `public/`.

`build:static` creates a portable `dist-static/` folder for domestic or other
third-party static hosts. It contains a conventional root `index.html` plus all
detail pages and assets, so it can be uploaded directly without a framework.

## Public deployment (Tencent CloudBase)

The public site is hosted in the CloudBase environment
`sysu-eohe-2026-d9gc38h0203342f7d` and is currently available at:

`https://sysu-eohe-2026-d9gc38h0203342f7d-1453818758.tcloudbaseapp.com/`

After editing content, build and deploy the portable output:

```sh
pnpm build:static
tcb login
tcb hosting deploy ./dist-static -e sysu-eohe-2026-d9gc38h0203342f7d
```

### Visitor overview

The footer-adjacent visitor module reads aggregate statistics from the
`visitor-stats-api` CloudBase function. It counts a browser at most once per
calendar day, stores only total and country/region counters, and never stores
IP addresses. The function source is in `functions/visitor-stats`; its endpoint
is configured as `VISITOR_STATS_ENDPOINT` in `script.js`.

CloudBase credentials are local machine credentials and must never be added to
the repository. The platform default domain is suitable for immediate access
but has development-domain rate limits; bind an ICP-filed custom domain later
for a permanent institutional production address.

## Public deployment (GitHub Pages)

The memorable public address is:

`https://eohelab.github.io/`

The repository is `eohelab/eohelab.github.io`. Every push to `main` triggers
`.github/workflows/deploy-pages.yml`, which builds `dist-static/` and publishes
it to GitHub Pages. Keep CloudBase online as the Chinese-mainland fallback.

Normal GitHub publishing therefore consists of committing and pushing the
source changes:

```sh
git add <changed-files>
git commit -m "Describe the website update"
git push github main
```

## Legacy Sites deployment

`.openai/hosting.json` retains the earlier Sites project connection for
reference. Keep its `project_id` unchanged, but use CloudBase as the primary
public deployment target while `chatgpt.site` remains inaccessible on the
user's network.
