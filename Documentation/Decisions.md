# INAYA — Decision Log

**Append-only.** This file captures the *why* behind choices. Existing entries are never rewritten or deleted. Each weekly run appends a new dated section. Decisions are translated into English from the German source (`INAYA_Technische_Entscheidungen.md`) and other project files.

---

## 2026-07-21 — Weekly update

First run of the automated documentation task. This entry seeds the log with the decisions on record so far (translated from `INAYA_Technische_Entscheidungen.md`, `docs/`, and `worklog.md`), most recent first.

### Campaign opener / intro page (2026-07-21)
- **Opener integrated as a React landing route.** A new `src/pages/CityOpener.jsx` was added on `/`, and the previous `LanguageChooser` was moved to `/sprache` (with the in-site language button in `Layout.jsx` updated). City links are now real rather than "coming soon": Basel → `inaya-soli.ch/ba`, Bern → `inaya-soli.ch/be` (external), Zürich → `/sprache` (stays in the app). *Why:* Bern and Basel already exist, so links should point to the real pages, and the opener belongs inside the new React site. Standalone `website-zu/opener.html` kept current in parallel. Build verified (`vite build`, 60 modules, ok).
- **Opener aesthetic reworked to a Riso/poster look** closer to the campaign artwork: grainy magenta spray-burst with irregular jagged spikes (SVG `feTurbulence` + `feDisplacementMap`), film-grain overlay (`mix-blend-mode: multiply`), large blocky Anton type in electric blue, city names as raw uppercase instead of pill buttons. *Why:* user feedback wanted it "more abstract / artsy, closer to the JPEG"; kept as a standalone, dependency-free HTML file.
- **Opener eye + logo iterations.** Earlier versions used a realistic animated eye (blink on load, pupil tracks cursor) in a pink/purple star-burst; feedback found the realistic eye "creepy" and asked to drop the typographic "INAYA"/slogan text and use the *proper* brand logo. Result: the real brand logo `assets/kleininaya.svg` is embedded inline (tinted electric blue via CSS, easily reversible), and the eye was simplified to a flat almond "blink" (no highlight, no iris rings, no cursor tracking). *Why:* the logo itself contains small eyes as letter accents — it fits the "watching eye" motif ("INAYA = the watching eye").

### Print-on-demand / dropshipping for merch (2026-07-21)
- **Researched Gelato, Printful, Printify, SPOD; leaning Gelato/Printful, free plan + manual fulfilment to start.** *Why:* no stock and no upfront financing wanted; Gelato's local production network is best for Switzerland (customs/VAT). Full analysis and P&L in `docs/dropshipping-pod-optionen-2026-07-21.md`.

### React rebuild & shop architecture (2026-07-14)
- **React on Vercel + zahls.ch (donations + merch, "Variant 1" payment links, no backend) + Eventfrog (tickets); WooCommerce rejected.** *Why:* WooCommerce only pays off with a large catalogue/inventory or frequent events; otherwise a lightweight mix has ~CHF 0 fixed cost (only transaction fees) and nothing to maintain. Later upgraded in-build to a cart + serverless checkout ("Variant 2") for sizes/quantities.
- **Keep domain + e-mail at cyon, host the React site on Vercel, point DNS at Vercel.** *Why:* Vercel gives Git-based auto-deploy and native React hosting for free (Hobby); cyon retains PHP/WordPress and @inaya-soli.ch e-mail that Vercel cannot provide.
- **Placeholder languages (en, it, es, ru, al, fa) re-translated from German rather than reused.** *Why:* the old site's versions contained outdated Basel content (Spanish even contained Kurdish); AI-translated, native-speaker review recommended before launch.

### Repository & infrastructure (2026-07-01 / 2026-07-06)
- **Local git repo for `website-zu` contains only `inaya-soli.ch/zu`.** *Why:* the rest of the cyon export (ba, be, merch, newsite, staging, e-mails, logs, SSL, backups) is out of scope or holds sensitive data (e.g. WordPress `wp-config.php` with DB credentials) and does not belong in a repo.
- **Cloudflare Pages as the test environment for design changes.** *Why:* free (unlimited bandwidth/requests), automatic per-branch preview links, free access protection — Netlify charges for that.
- **Introduce git versioning for inaya-soli.ch.** *Why:* previously no rollback was possible on errors (cf. the newsite incident).
- **`newsite.inaya-soli.ch` (WordPress migration of the main site) not pursued.** *Why:* no functional need (no shop), content changes rarely — maintenance not justified.
- **`merch.inaya-soli.ch` stays on WordPress/WooCommerce.** *Why:* it already covers shop logic (cart, orders, zahls.ch integration) that would be disproportionate to rebuild.

### Note on git state
Both repos currently hold only their initial commits (`website-react` 2026-07-15, `website-zu` 2026-07-06). This week's opener work (`CityOpener.jsx`, edits to `App.jsx`/`Layout.jsx`/`index.html`/`index.css`, and `website-zu/opener.html`) exists as **uncommitted working-tree changes** and is documented here from the worklog/decision files rather than from git history.
