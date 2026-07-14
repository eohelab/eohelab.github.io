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
```

The `sync:content` step copies the framework-independent site into `public/`
before every preview or build. Treat the root HTML/CSS/JS files, `content/`, and
`assets/` as the source of truth; do not edit generated copies under `public/`.

## Deployment boundary

`.openai/hosting.json` connects this folder to its Sites project. Keep its
`project_id` unchanged. A future maintenance task should build, validate, save a
new site version, and deploy that version after updating content.
