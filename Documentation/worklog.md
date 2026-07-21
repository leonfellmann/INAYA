# INAYA Worklog

## 14.07.2026 — React-Neubau der Website mit Soli-Shop

Entscheidung (siehe hosting-shop-options-2026-07-14.md): React auf Vercel,
zahls.ch für Spenden + Merch (Variante 1, Payment Links, ohne Backend),
Eventfrog für Tickets. WooCommerce verworfen.

### Gebaut: `website-react/`
- Vite + React 18 + react-router, Tailwind mit Original-Farbpalette
- Alle 11 Sprachen, RTL für ar/fa
- Vollständige Inhalte migriert: de, fr, ar, ku, tu
- Fallback auf Deutsch mit Hinweisbanner: en, it, es, ru, al, fa
  (diese enthielten in der alten Site veraltete Basel-Inhalte, es sogar Kurdisch)
- Neuer Soli-Shop: 3 Platzhalter-Produkte + Spendenbereich,
  zahls.ch-Links in `src/data/products.js` einsetzbar
- Datenschutzseite als standalone `public/datenschutz.html` bereinigt
- `vercel.json` für SPA-Routing

### Behobene Fehler der alten Site
- Falsche Kontonummern auf ku ("16-23816-26") und tu ("15-23816-2") Spendenseiten
- Veralteter Basel-TWINT-Block auf ar Spendenseite
- RaiseNow-Link existierte nur auf Deutsch → jetzt in allen Sprachen (mit lng-Param)
- Deutsche Popup-Labels auf ku/tu → übersetzt
- Kaputte Asset-Referenzen der Platzhalter-Sprachen

### Verifikation
- SSR-Smoke-Test: alle 67 Routen rendern (src/ssr-test.jsx)
- 19 inhaltliche Checks bestanden (src/content-check.jsx)
- Produktions-Build fehlerfrei

### Nachtrag gleicher Tag — Vollübersetzung + dynamische Features

**Übersetzungen:** en, it, es, ru, al, fa komplett neu aus dem Deutschen
übersetzt (KI-Übersetzung, Review durch Muttersprachler:innen empfohlen).
Alle 11 Sprachen jetzt vollständig, gleiches Layout. RTL für ar + fa.

**Neue Features:**
1. News via `public/news.json` (editierbar ohne Code, mehrsprachig)
2. Events via `public/events.json` (Eventfrog-Links, Vergangenes auto-ausgeblendet)
3. Spendenziel-Thermometer via `public/donation-goal.json`
4. Browsersprache-Erkennung auf `/` mit gemerkter Sprachwahl
5. Kontaktseite `/:lang/kontakt` mit Formspree-Formular (Endpoint in
   `src/data/config.js`; bis dahin Mailto-Fallback)
6. Warenkorb (Grössen, Mengen, localStorage) + Serverless-Checkout
   `api/checkout.js` für zahls.ch/Payrexx-API (Env-Vars: ZAHLS_INSTANCE,
   ZAHLS_API_SECRET; serverseitige Preisliste gegen Manipulation)

**Verifikation:** 77 Routen rendern, 27 Content-Checks bestanden, Build sauber.

### Offen
- zahls.ch-Konto erstellen → Env-Vars in Vercel setzen (Checkout scharf schalten)
- Formspree-Formular erstellen → Endpoint in config.js
- Echte Produktfotos/Preise (products.js + PRICES in api/checkout.js)
- Übersetzungen (en/it/es/ru/al/fa + store.js) von Muttersprachler:innen prüfen
- GitHub-Repo + Vercel-Deployment
- Visueller Test im Browser

## 2026-07-21 — Print-on-Demand / Dropshipping recherchiert
Optionen für Merch-Dropshipping (à la Printful) für den neuen React-Shop geprüft.
Anbieter Gelato, Printful, Printify, SPOD verglichen (Preise/Abos vom 21.07.2026).
Kernpunkt Schweiz: Zoll/Einfuhr-MwSt 8.1 %, aber Bagatellgrenze ~CHF 62 → einzelne
Shirts kommen meist gebührenfrei an. Gelato via lokalem Produktionsnetz am besten.
Integration: 3 Wege (A manuell / B API an api/checkout.js / C WooCommerce-Plugin).
P&L modelliert: T-Shirt @ CHF 30 → ~CHF 12–18 netto (41–61 %). Sticker via POD
sinnlos (~2 %). Vollständige Analyse: docs/dropshipping-pod-optionen-2026-07-21.md
