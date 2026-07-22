# INAYA redesign — drop-in handoff

This is the 2A direction (blinking eye centred in the rotating grainy starburst, electric-blue
Rubik Black statement below) applied to your existing Vite + React + Tailwind app. The files
below **replace** the same paths in your repo — copy them in and commit. Nothing outside these
files changes; routing, i18n, cart and the CityChooser opener are untouched.

## Files in this package (copy to the same path in the repo)

| File | Change |
| --- | --- |
| `index.html` | Font `<link>` now loads **Rubik** (display) alongside Anton (opener) + Montserrat (body). |
| `src/index.css` | `.font-display` is now Rubik Black; added `.inaya-burst-*` / `.inaya-eye` classes + `iz-blink` keyframe for the home hero. `.iz` opener styles are unchanged. |
| `src/components/StarBurst.jsx` | **New.** The hero mark — deterministic grainy starburst + blinking eye (same star algorithm as the opener). |
| `src/pages/Home.jsx` | New hero (StarBurst with centred blinking eye + bilingual-source manifest), pill CTAs. German shows the full manifest; other languages show the localised slogan (`t.home.title`). |
| `src/components/Layout.jsx` | Restyled header (logo · Spenden pill · hamburger · city tabs), full-screen menu overlay, contact/donate popup and footer — all in the new system. Same logic/links as before. |
| `src/pages/ContentPage.jsx` | Give page: **bank QR removed** (online-donate + TWINT QR kept). Friends page now renders `city.friends` (see below). |
| `src/data/cities.js` | Added a per-city `friends` list so each city shows the **other** two INAYA cities + shared partner orgs — no more Zürich/Basel mixing. |

## Notes / TODO

- **Friends partner orgs**: the shared list is the verified Zürich set applied to all three cities.
  If Basel or Bern maintain their own distinct partner links on inaya-soli.ch, split them in
  `SHARED_FRIENDS` / per-city `friends` in `cities.js` (marked with a TODO there).
- **Manifest translations**: only DE (and EN via the slogan) are wordsmithed. Non-German locales
  fall back to `t.home.title`; drop real translations into your i18n JSON if you want the full
  manifest in every language.
- **Fonts**: if you self-host fonts, add Rubik (400–900) to your pipeline; otherwise the Google
  Fonts link in `index.html` covers it.
- `tailwind.config.js` needs **no change** — all colours (lila, turc, lima, gris, elektro, magenta)
  already exist.

## Interactive reference

`INAYA Website.dc.html` (in the project root) is the working prototype these files were built from —
open it to see every screen, the city switch, cart and all 11 languages (RTL for AR/FA).
