# INAYA Zürich — React Website

React-Neubau von inaya-soli.ch/zu mit integriertem Soli-Shop (Merch + Spenden).

## Entwicklung

```bash
npm install
npm run dev      # lokaler Dev-Server
npm run build    # Produktions-Build nach dist/
```

## Tests

```bash
npx vite build --ssr src/ssr-test.jsx --outDir dist-ssr && node dist-ssr/ssr-test.js        # rendert alle 67 Routen
npx vite build --ssr src/content-check.jsx --outDir dist-ssr && node dist-ssr/content-check.js  # inhaltliche Checks
```

## Deployment (Vercel)

1. Repo zu GitHub pushen
2. Auf vercel.com "Import Project" → Repo wählen → Framework "Vite" wird erkannt
3. `vercel.json` (SPA-Rewrites) liegt bereits im Repo
4. Domain/Subdomain per DNS auf Vercel zeigen (Domain kann bei bisherigem Registrar bleiben)

## Sprachen

Alle 11 Sprachen vollständig: de, fr, ar, ku, tu (aus der alten Site übernommen);
en, it, es, ru, al, fa (KI-übersetzt aus dem Deutschen, Juli 2026 — bitte vor
Launch von Muttersprachler:innen prüfen lassen, ebenso `src/i18n/store.js`).

RTL (Arabisch, Farsi) wird automatisch gesetzt. Beim ersten Besuch von `/`
wird die Browsersprache erkannt und weitergeleitet; das Sprach-Icon im Menü
zeigt weiterhin die Sprachauswahl.

## Inhalte ohne Code-Änderung pflegen (public/*.json)

- `public/news.json` — News auf der Startseite (mehrsprachig, Fallback de)
- `public/events.json` — Events mit Datum/Ort/Ticket-Link (z.B. Eventfrog);
  vergangene Events werden automatisch ausgeblendet
- `public/donation-goal.json` — Spendenziel-Thermometer auf der Shop-Seite
  (`enabled`, `goalChf`, `currentChf`)

Diese Dateien können direkt auf GitHub im Browser bearbeitet werden —
Vercel deployt automatisch.

## Shop & Checkout (zahls.ch)

Der Shop hat einen Warenkorb. Zwei Wege zur Bezahlung:

**A) Warenkorb-Checkout via API (empfohlen):**
1. zahls.ch-Konto erstellen (Gratis-Abo, 2.9% + CHF 0.30 pro Transaktion)
2. Im zahls.ch-Dashboard einen API-Key erstellen
3. In Vercel → Settings → Environment Variables setzen:
   `ZAHLS_INSTANCE` (Instanzname) und `ZAHLS_API_SECRET`
4. Fertig — `api/checkout.js` erstellt pro Kauf ein Payment-Gateway.
   Solange die Variablen fehlen, zeigt der Checkout "Bald verfügbar".
5. Preise ändern? In `src/data/products.js` UND in `PRICES` in
   `api/checkout.js` (serverseitige Preisliste, manipulationssicher).

**B) Direkte Payment Links (ohne API):** Links in `src/data/products.js`
bei `paylink`/`paylinks` eintragen → zusätzlicher Direkt-Kauf-Button.

Spendenformular-Link: `donationLink` in `src/data/products.js`
(aktuell RaiseNow-Link der alten Site).

## Kontaktformular (Formspree)

Gratis-Formular auf formspree.io erstellen und Endpoint in
`src/data/config.js` bei `FORMSPREE_ENDPOINT` eintragen. Solange leer,
zeigt die Kontaktseite einen Mailto-Fallback.

## Struktur

- `src/i18n/*.json` — Inhalte pro Sprache (aus alter Site extrahiert)
- `src/i18n/store.js` — Shop-UI-Strings (11 Sprachen, bitte von Muttersprachler:innen prüfen)
- `src/data/products.js` — Produkte + Payment-Links
- `src/components/Layout.jsx` — Header, Menü, Kontakt/Spenden-Popup, Footer
- `src/pages/` — Seiten (Home, ContentPage generisch, Shop, LanguageChooser)
- `public/datenschutz.html` — alte Datenschutzseite unverändert übernommen

## Bekannte Korrekturen gegenüber der alten Site

- Veraltete Bankdaten-Blöcke (altes Basel-TWINT, Tippfehler in Kontonummern
  bei ku/tu) werden gefiltert und zentral korrekt gerendert
- Sprachen en/it/es/ru/al/fa enthielten veraltete Basel-Inhalte (es sogar
  Kurdisch) — bewusst durch deutschen Fallback ersetzt
- RaiseNow-Spendenlink jetzt in allen Sprachen (vorher nur de)
