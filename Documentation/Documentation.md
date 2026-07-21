# INAYA — Technical Documentation

> Regenerated automatically — last update **2026-07-21**. Fully rewritten each weekly run to reflect the current state. Translated into English from the German source files.

## Overview

The INAYA web presence is being migrated from a static, multilingual, cyon-hosted site (`inaya-soli.ch/zu`, kept in `website-zu/`) to a modern React application (`website-react/`) deployed on Vercel, with an integrated solidarity shop. Both live side by side in this project until the React site replaces the static one. This document describes the architecture, tech stack, and how the pieces fit together.

## Architecture at a glance

```
Visitor
  │
  ├─ (new)  Vercel ──────────────► website-react  (React SPA, Vite build)
  │            │                      ├─ /                → CityOpener (campaign intro)
  │            │                      ├─ /sprache         → language chooser
  │            │                      ├─ /:lang/...       → content pages, shop, contact
  │            │                      └─ /api/checkout    → serverless fn → zahls.ch/Payrexx
  │            └─ public/*.json (news, events, donation goal) — editable without code
  │
  └─ (current) cyon ─────────────► website-zu  (static HTML per language)
               └─ opener.html (standalone animated intro)

External services: zahls.ch/Payrexx (payments), Eventfrog (ticketing),
Formspree (contact form), RaiseNow (donations, legacy link), cyon (domain + e-mail).
```

## website-react — the React rebuild

### Tech stack
- **Build tool:** Vite 5
- **Framework:** React 18.3 with React Router DOM 6.26 (client-side routing, SPA)
- **Styling:** Tailwind CSS 3.4 (with the original brand colour palette), PostCSS + Autoprefixer
- **Deployment target:** Vercel (Zero-Config Vite detection); `vercel.json` provides SPA rewrites and passes `/datenschutz.html` through untouched
- **Serverless:** one Vercel function, `api/checkout.js`
- **No state library / no CSS framework beyond Tailwind** — dependencies are deliberately minimal (`react`, `react-dom`, `react-router-dom` only in production deps)

### Source structure (`src/`)
```
src/
├── main.jsx                # entry point
├── App.jsx                 # route table
├── index.css               # Tailwind entry + base styles
├── pages/
│   ├── CityOpener.jsx      # NEW: campaign intro / opener on "/"
│   ├── LanguageChooser.jsx # language selection, now on "/sprache"
│   ├── Home.jsx            # per-language landing
│   ├── ContentPage.jsx     # generic content page (data-driven from i18n)
│   ├── Shop.jsx            # solidarity shop (products + donation area)
│   └── Contact.jsx         # contact form (Formspree, mailto fallback)
├── components/
│   ├── Layout.jsx          # header, menu, contact/donation popup, footer, in-site language button
│   ├── News.jsx            # renders public/news.json
│   ├── Events.jsx          # renders public/events.json (past events auto-hidden)
│   └── DonationMeter.jsx   # donation-goal thermometer from public/donation-goal.json
├── context/
│   └── CartContext.jsx     # cart state (sizes, quantities, localStorage persistence)
├── data/
│   ├── products.js         # product catalogue + payment links + donation link
│   └── config.js           # config incl. FORMSPREE_ENDPOINT
├── i18n/
│   ├── index.js            # i18n loader / helpers
│   ├── store.js            # shop UI strings (all 11 languages)
│   └── <lang>.json         # page content per language (al, ar, de, en, es, fa, fr, it, ku, ru, tu)
├── ssr-test.jsx            # SSR smoke test — renders every route
└── content-check.jsx       # content assertions
```

### Routing model
- `/` renders **CityOpener** — the campaign intro (animated watching-eye + city selection). City links: Basel → `inaya-soli.ch/ba` (external), Bern → `inaya-soli.ch/be` (external), Zürich → `/sprache` (stays in the app).
- `/sprache` renders the **LanguageChooser** (moved off `/` when the opener was added). The in-site language button in `Layout.jsx` points here.
- `/:lang/...` renders content pages, the shop, and the contact page for a given language. On first visit to `/`, browser language is detected and remembered.

### Internationalisation (i18n)
- **11 languages:** `de`, `fr`, `ar`, `ku`, `tu` were carried over from the old site; `en`, `it`, `es`, `ru`, `al`, `fa` were re-translated from German by AI in July 2026 and **should be reviewed by native speakers before launch** (including `store.js`).
- Page content lives in `src/i18n/<lang>.json`; shop UI strings live in `src/i18n/store.js`.
- **RTL** (right-to-left) is set automatically for Arabic (`ar`) and Farsi (`fa`).
- The old site's placeholder languages (`en`, `it`, `es`, `ru`, `al`, `fa`) had contained outdated Basel content (Spanish even contained Kurdish); these were replaced with proper translations.

### Content management without code (`public/*.json`)
These files can be edited directly on GitHub in the browser; Vercel auto-deploys on push:
- `public/news.json` — homepage news (multilingual, German fallback).
- `public/events.json` — events with date/location/ticket link (e.g. Eventfrog); past events auto-hidden.
- `public/donation-goal.json` — donation thermometer on the shop page (`enabled`, `goalChf`, `currentChf`).

### Shop & checkout
The shop has a cart (sizes, quantities, `localStorage`). Two payment paths:

**A) Cart checkout via API (recommended).** `api/checkout.js` creates a payment gateway per purchase via the zahls.ch/Payrexx API. Requires Vercel env vars `ZAHLS_INSTANCE` and `ZAHLS_API_SECRET`; until they are set, checkout shows "coming soon". Prices are held server-side in a `PRICES` list in `api/checkout.js` (tamper-proof) and must be kept in sync with `src/data/products.js`. zahls.ch fee: 2.9% + CHF 0.30 per transaction.

**B) Direct payment links (no API).** Enter links under `paylink`/`paylinks` in `src/data/products.js` for a direct-buy button.

Donations use `donationLink` in `products.js` (currently the legacy RaiseNow link, now surfaced in all languages — previously German only).

### Contact form
Formspree free form; set the endpoint in `src/data/config.js` (`FORMSPREE_ENDPOINT`). While empty, the contact page falls back to a mailto link.

### Corrections carried over from the old site
- Outdated bank-data blocks filtered out and rendered centrally & correctly (old Basel TWINT block; typo'd account numbers on `ku` "16-23816-26" and `tu` "15-23816-2").
- German popup labels on `ku`/`tu` were translated.
- The RaiseNow donation link now appears in every language.
- Broken asset references on the placeholder languages fixed.

### The opener / intro page (built 2026-07-21)
A campaign intro built in the pink/magenta **Riso/poster aesthetic** of the campaign artwork: a grainy magenta spray-burst with irregular jagged spikes (SVG `feTurbulence` + `feDisplacementMap`), a film-grain overlay (`mix-blend-mode: multiply`), large blocky Anton-type "INAYA" in electric blue, and city names as raw uppercase. The eye motif references the brand ("INAYA = the watching eye"). Delivered in two forms:
- **React route:** `src/pages/CityOpener.jsx` on `/` (with the language chooser moved to `/sprache`). Build verified via `vite build`.
- **Standalone:** `website-zu/opener.html` — a single dependency-free HTML file (inline CSS/JS + SVG, Google Fonts Anton/Montserrat via CDN), directly deployable to the existing static host. It uses the real brand logo `assets/kleininaya.svg` (inline, tinted electric blue via CSS) with a simplified almond "blink" eye.

### Verification status
The React site's own tests pass: SSR smoke test renders all routes (77 at last full run) and content checks pass (27 at last full run); production build is clean. The latest opener change was verified with `vite build` (60 modules, ok).

## website-zu — the static live site

The current production site, exported from cyon. Plain static HTML organised by language folder (`al`, `ar`, `de`, `en`, `es`, `fa`, `fr`, `it`, `ku`, `ru`, `tu`), plus a shared `assets/` folder and root `index.html`. The git repo deliberately contains **only** `inaya-soli.ch/zu`; the rest of the cyon export (ba, be, merch, newsite, staging-newsite, e-mails, logs, SSL, backups) was excluded because it is out of scope or contains sensitive data (e.g. WordPress `wp-config.php` with DB credentials).

Known issues logged for this site (see `INAYA_Naechste_Schritte.md`): the language menu link goes nowhere despite complete language folders already existing; small bugs (`<a herf="">` typo, invalid `top-600` class in a popup, missing `lang="de"` on `<html>`); the "current information" homepage block still says "nothing new"; oversized images (e.g. `Inaya_Kalender.png` ~32 MB per language) need `width`/`height` and compression; several CDN dependencies (Tailwind CDN, Alpine CDN, Google Fonts, Reframe.js) could be reduced.

## Hosting & deployment

| | cyon (current) | Vercel (target for React) |
|---|---|---|
| Price | from CHF 5.90/mo | Hobby: free (100 GB traffic) |
| Git deploy | no (FTP/SSH, manual) | yes, automatic on push |
| React | static build upload only | native, zero-config |
| PHP/WordPress | yes | no |
| E-mail (@inaya-soli.ch) | yes | no |

Recommended combination: keep **domain + e-mail at cyon**, host the React site on **Vercel**, point DNS at Vercel. Note: Vercel Hobby is officially "personal, non-commercial" — non-profit use is a tolerated grey area; Pro would be USD 20/mo. Cloudflare Pages is used as a free test environment for design changes (free preview links per branch, optional free access protection).

## External services

- **zahls.ch / Payrexx** — payments (TWINT, cards, PostFinance); Swiss provider, sister brand of Payrexx; free plan, 2.9% + CHF 0.30 per transaction; official WooCommerce plugin exists.
- **Eventfrog** — ticketing (Swiss, free for organisers on free/low-cost events, embeddable). Handles QR codes / entry control, which zahls.ch does not.
- **Formspree** — contact form backend.
- **RaiseNow** — donations (legacy link, still in use).
- **cyon** — domain registration and e-mail.

## Print-on-demand / dropshipping (research, 2026-07-21)

Options evaluated for selling merch with no stock and no upfront financing (Printful-style POD): Gelato, Printful, Printify, SPOD/Spreadconnect. All are free to start (pay per order). Key Swiss consideration: import VAT 8.1% + carrier handling fee on cross-border shipments, but the *de minimis* threshold (tax ≤ CHF 5, i.e. order value incl. shipping up to ~CHF 62) means a single shirt usually arrives free of extra charges — multi-item orders over ~CHF 62 do not. **Gelato** is favoured for Switzerland (local production network, VAT shown in checkout), with **Printful** a strong alternative for single items. Recommended start: free plan + manual fulfilment (Way A); automate later via the Vercel function order-API (Way B) or a WooCommerce POD plugin on `merch.inaya-soli.ch` (Way C). Modelled margin: a CHF 30 shirt nets ~CHF 12–18 (41–61%); stickers via POD are not worth it (~2%). Full analysis: `docs/dropshipping-pod-optionen-2026-07-21.md`.

## Related systems (out of the React scope)
- `merch.inaya-soli.ch` — stays on **WordPress/WooCommerce** by decision (handles cart, orders, zahls.ch integration; rebuilding it would be disproportionate).
- `newsite.inaya-soli.ch` (WordPress migration of the main site) — **not pursued** (no functional need, content rarely changes).
