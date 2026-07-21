# Hosting & Shop Options — Notizen vom 14.07.2026

## Kontext
Überlegung, inaya-soli.ch/zu als React-Seite neu zu bauen, mit Shop-Funktionen:
Spenden, Merch, Event-Tickets.

## Hosting: cyon vs. Vercel

| | cyon | Vercel |
|---|---|---|
| Preis | ab CHF 5.90/Mt (Personal), CHF 14.90/Mt Standard | Hobby: gratis (100 GB Traffic) |
| Git-Deploy | nein (FTP/SSH, manuell) | ja, automatisch bei jedem Push |
| React | nur statisches Build hochladen | nativ, Zero-Config |
| PHP/WordPress | ja | nein |
| E-Mail (@inaya-soli.ch) | ja | nein |

Hinweis: Vercel Hobby ist offiziell "personal, non-commercial" — Non-Profit ist Grauzone, meist toleriert. Pro wäre USD 20/Mt.

Empfohlene Kombi: Domain + E-Mail bei cyon behalten, React-Site auf Vercel, DNS auf Vercel zeigen.

## Shop: Spenden + Merch + Tickets

### Option A: Headless WooCommerce
- WordPress + WooCommerce auf cyon, React-Frontend holt Daten via Store API / WooGraphQL
- Ein Admin für alles
- Nachteile: WordPress-Wartung, gesamte Shop-UI selbst in React bauen, Twint-Integration im headless Checkout fiddly
- Kosten: ~CHF 15/Mt + Transaktionsgebühren

### Option B: Leichtgewichtiger Mix (Empfehlung)
- **Spenden:** zahls.ch Spendenformular (Twint, Karten, PostFinance) — Alternativen: RaiseNow, Payrexx
- **Merch:** zahls.ch One-Page-Shop / Payment Links, embeddable in React
- **Tickets:** Eventfrog (CH, gratis für Veranstalter bei Gratis-/Low-Cost-Events, embeddable). zahls.ch kann Ticket-Zahlung, aber kein Ticketing (keine QR-Codes/Einlasskontrolle)
- Kein Backend zu warten, ~CHF 0/Mt fix, nur Transaktionsgebühren
- Nachteil: 2 getrennte Dashboards (zahls.ch + Eventfrog)

### zahls.ch Details (geprüft 14.07.2026)
- Schweizer Anbieter, Schwesterbrand von Payrexx
- Gratis-Abo ohne Fixkosten, 2.9% + CHF 0.30 pro Transaktion
- Twint, Kreditkarten, PostFinance
- Offizielles WooCommerce-Plugin vorhanden (falls doch Option A)
- Quellen: zahls.ch/en/prices-credit-cards-and-twint, zahls.ch/en/simply-receive-donations-with-twint

### Entscheidungskriterium
Option A lohnt sich erst bei grossem Merch-Katalog mit Lagerverwaltung oder sehr häufigen Events. Sonst Option B.

## Shop ohne WooCommerce (React + zahls.ch direkt)

**Variante 1 — ohne Backend (empfohlen als Start):**
Pro Produkt ein zahls.ch Payment Link / One-Page-Shop-Eintrag. React-Seite ist nur Produkt-Galerie, "Kaufen" öffnet zahls.ch-Checkout. Kein Server nötig. Grössen via separatem Link pro Grösse oder Feld auf der Payment Page. Gut für ~5–20 Produkte.

**Variante 2 — mit Warenkorb:**
React-Cart + eine Serverless Function auf Vercel, die via zahls.ch/Payrexx-API eine Checkout-Session für den Warenkorb-Betrag erstellt. Nötig bei Mengen, Varianten, Versandberechnung.

**Was ohne WooCommerce fehlt:** Lagerverwaltung, Bestell-Admin, automatische Kundenmails. zahls.ch-Dashboard zeigt alle Transaktionen — reicht für Vereins-Massstab, Versand manuell.

**Fazit:** WooCommerce nicht nötig. Start mit Variante 1, Upgrade auf 2 bei Bedarf.

## Status
Tendenz: React auf Vercel + zahls.ch (Spenden + Merch, Variante 1) + Eventfrog (Tickets). WooCommerce verworfen.
