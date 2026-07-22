# INAYA Website Project

> Documentation regenerated automatically — last update **2026-07-21**.
> This file is fully rewritten on each weekly run. For the *why* behind choices, see `Decisions.md`. For deep technical detail, see `Documentation.md`.

## What is INAYA

INAYA is a Swiss solidarity organisation (INAYA Solidarität, `inaya-soli.ch`). The web presence centres on the Zürich chapter and combines information pages, a multilingual campaign site, and a solidarity shop (merchandise + donations + event tickets). "INAYA" is used as the metaphor of *the watching eye* — reflected in the branding and the animated intro ("opener") page.

The project currently spans **two websites**, both kept as local git repositories inside this project folder.

## The two sites

### 1. `website-react/` — the new build
A ground-up React rebuild of `inaya-soli.ch/zu` with an integrated solidarity shop (merch + donations). This is where active development happens.

- Stack: Vite + React 18 + React Router 6, Tailwind CSS 3.
- 11 languages, RTL for Arabic and Farsi.
- Content-managed shop with a cart, serverless checkout via zahls.ch/Payrexx, news/events/donation-goal driven by editable JSON files.
- Intended host: **Vercel** (Git-based auto-deploy).

### 2. `website-zu/` — the current live static site
The existing static multilingual site exported from the cyon file manager (`inaya-soli.ch/zu`). Plain HTML per language folder (`de`, `en`, `fr`, `ar`, `ku`, `tu`, `it`, `es`, `ru`, `al`, `fa`). Still the production site until the React rebuild goes live. A standalone animated `opener.html` intro page is maintained here in parallel with the React opener.

## How to run / build / deploy

### website-react
```bash
cd website-react
npm install
npm run dev      # local dev server
npm run build    # production build → dist/
npm run preview  # preview the production build
```

Verification / smoke tests:
```bash
# render every route server-side
npx vite build --ssr src/ssr-test.jsx --outDir dist-ssr && node dist-ssr/ssr-test.js
# content assertions
npx vite build --ssr src/content-check.jsx --outDir dist-ssr && node dist-ssr/content-check.js
```

Deploy (Vercel):
1. Push the repo to GitHub.
2. On vercel.com → Import Project → select the repo (framework auto-detected as Vite).
3. `vercel.json` (SPA rewrites) is already in the repo.
4. Set environment variables for checkout (`ZAHLS_INSTANCE`, `ZAHLS_API_SECRET`) once the zahls.ch account exists.
5. Point the domain/subdomain at Vercel via DNS (domain and e-mail can stay at cyon).

### website-zu
Static site — no build step. Deployed by uploading files to cyon (FTP/SSH) or served as-is. `opener.html` is a single self-contained file (inline CSS/JS/SVG, only Google Fonts via CDN) and can be dropped in directly.

## Folder structure (project root)

```
INAYA/
├── CLAUDE.md                          # project instruction: always document everything
├── Documentation/                     # ← this folder (auto-maintained)
│   ├── README.md                      # this file (regenerated weekly)
│   ├── Documentation.md               # technical documentation (regenerated weekly)
│   └── Decisions.md                   # append-only decision log
├── docs/
│   ├── worklog.md                     # running work journal
│   ├── hosting-shop-options-2026-07-14.md
│   └── dropshipping-pod-optionen-2026-07-21.md
├── INAYA_Naechste_Schritte.md         # next-steps backlog (German)
├── INAYA_Technische_Entscheidungen.md # technical decisions log (German)
├── INAYA_Projektbeschreibung.docx     # project description (German)
├── Übergabe Websites INAYA ZH.docx    # site handover notes (German)
├── website-react/                     # React rebuild (git repo, branch: main)
└── website-zu/                        # static live site export (git repo, branch: master)
```

## Current status (as of 2026-07-21)

The React site is functionally complete (all 11 languages, shop, cart, checkout scaffolding, news/events/donation meter) and passes its SSR + content-check tests. It is **not yet deployed** and several launch items remain open.

Active this week: a new campaign **opener / intro page** was built — an animated "watching eye" in the campaign's pink/magenta star-burst (Riso/poster) aesthetic, added both as a React landing route (`CityOpener.jsx` on `/`) and as a standalone `website-zu/opener.html`. Print-on-demand / dropshipping options for merch were also researched (recommendation: Gelato or Printful, free plan + manual fulfilment to start).

Open before launch: create the zahls.ch account and set Vercel env vars; create the Formspree contact form; add real product photos/prices; have the AI-translated languages (en, it, es, ru, al, fa) reviewed by native speakers; push both repos to GitHub and deploy; rename the `website-zu` git branch from `master` to `main`. See `INAYA_Naechste_Schritte.md` for the full backlog.
