# Dropshipping / Print-on-Demand für den INAYA Soli-Shop — Optionen, Kosten, P&L

Notiz vom 21.07.2026. Quellenstand: Anbieter-Preisseiten, geprüft 21.07.2026 (siehe unten).

## Ziel
Merch (T-Shirts, Taschen etc.) verkaufen, ohne Lager und ohne Vorfinanzierung.
Produktion + Versand übernimmt ein Print-on-Demand-Anbieter (POD), sobald eine
Bestellung eingeht. Modell wie printful.com. Frage: Was passt zum **neuen
React-Shop** (Vercel + zahls.ch/Payrexx), und wie sieht die Marge aus?

## Ausgangslage (was schon existiert)
- React-Shop auf Vercel, Warenkorb (Grössen/Mengen, localStorage).
- Checkout über `api/checkout.js` → zahls.ch/Payrexx-Gateway (2.9 % + CHF 0.30 pro Transaktion).
- Aktuell **manuelle Erfüllung**: zahls.ch-Dashboard zeigt Bestellungen, Versand von Hand.
- Produkte sind Platzhalter in `src/data/products.js` (T-Shirt CHF 30, Tasche CHF 20, Sticker CHF 5).
- Parallel läuft `merch.inaya-soli.ch` noch auf **WooCommerce** (bewusste Entscheidung, siehe Technische Entscheidungen).

Das ist wichtig, weil POD-Anbieter fertige Plugins für Shopify/WooCommerce/Etsy
haben, aber **nicht** für einen selbstgebauten React+zahls.ch-Checkout. Wie POD
angebunden wird, hängt also davon ab, wo der Shop am Ende läuft (siehe „Integration").

---

## Die entscheidende Schweiz-Frage: Zoll & Einfuhr-MwSt
Fast alle grossen POD-Anbieter produzieren im EU-Ausland (Lettland, Spanien,
Deutschland, Niederlande) oder den USA. Jede Sendung über die CH-Grenze löst
grundsätzlich **Einfuhr-MwSt 8.1 %** plus eine **Verzollungs-/Bearbeitungsgebühr**
des Transporteurs aus (Post ~CHF 11.50+, Kuriere oft mehr).

Aber: Es gibt die **Bagatellgrenze**. Einfuhr-MwSt wird nicht erhoben, wenn der
Steuerbetrag ≤ CHF 5 wäre. Bei 8.1 % heisst das: Sendungen mit Warenwert (inkl.
Versand) bis ca. **CHF 62** kommen praktisch **zoll- und gebührenfrei** an.

Konsequenz für den Shop:
- **Einzelnes T-Shirt (~CHF 30–40): meist keine Zusatzkosten für den Kunden.** Gut.
- **Mehrteilige Bestellung > ~CHF 62** (z. B. 3 Shirts): Einfuhr-MwSt + Gebühr landen
  beim Kunden → schlechte Erfahrung, Beschwerden.

Zwei Wege, das zu entschärfen:
1. **Gelato** wählt automatisch den Produktionspartner am nächsten zum Kunden
   (lokales Netzwerk, 32 Länder) und weist MwSt/Zoll bereits **im Checkout** aus –
   keine Überraschungsgebühren beim Empfang.
2. **Lokaler CH-Druckdienst** (z. B. Schweizer Print-Partner mit Dropshipping) –
   gar kein Grenzübertritt. Kleineres Sortiment, oft teurer pro Stück, aber sauber.

> Hinweis MwSt auf *eigene* Verkäufe: Ein gemeinnütziger Verein ist bis CHF 250'000
> Umsatz von der Schweizer MwSt-Pflicht befreit (Normalgrenze CHF 100'000). INAYA
> muss auf die Merch-Verkäufe also voraussichtlich keine MwSt aufschlagen. Vor
> Scharfschaltung mit Treuhand/Verein kurz bestätigen.

---

## Anbietervergleich (Stand 21.07.2026)

| Anbieter | Fixkosten | Rabatt-Abo | Produktion | Schweiz-Tauglichkeit | Anbindung |
|---|---|---|---|---|---|
| **Gelato** | CHF 0 | Gelato+ $19.99/Mt (jährl.) bzw. $29.99/Mt, bis 33 % Rabatt | Lokales Netzwerk, 140+ Standorte in 32 Ländern; wählt nächsten zum Kunden | **Beste**: kurze Wege, MwSt im Checkout ausgewiesen | API, WooCommerce, Shopify, Etsy, Order Desk |
| **Printful** | CHF 0 | Growth $24.99/Mt (gratis ab $12k Jahresumsatz), bis 33 % Rabatt | Eigene Werke, u. a. EU (Lettland/Spanien) | Gut für Einzelstücke; grössere Sendungen zollpflichtig | API, WooCommerce, Shopify, Etsy, 20+ Plattformen |
| **Printify** | CHF 0 | Premium $24.99/Mt (jährl.) bzw. $39/Mt, bis 33 % Rabatt | Marktplatz aus 90+ Druckereien (Qualität variiert) | Gut, wenn EU-Druckerei gewählt wird | API, WooCommerce, Shopify, Etsy |
| **SPOD / Spreadconnect** | CHF 0 | kein Abo, Mengenrabatt | Deutschland (Leipzig), schnelle 48h-Produktion | Solide (kurzer Weg DE→CH), aber Grenzübertritt bleibt | API, WooCommerce, Shopify *(Live-Preise 21.07. nicht abrufbar, bitte vor Entscheid prüfen)* |

Alle Anbieter: **keine Vorauskosten, keine Provision** – bezahlt wird pro
Bestellung (Produkt + Versand). Das Abo lohnt sich nur, wenn der Rabatt die
Abo-Gebühr übersteigt (Break-even siehe unten).

---

## Integration in den bestehenden Shop — 3 Wege

**Weg A — Manuell (Sofort-Start, empfohlen für den Anfang).**
Kunde zahlt via zahls.ch → jemand legt die Bestellung von Hand im POD-Dashboard an.
Kein Code, funktioniert heute. Passt bis ca. 20–30 Bestellungen/Monat. Nachteil:
Handarbeit, Fehlerquelle bei Grösse/Adresse.

**Weg B — Automatisch über die bestehende Vercel-Function.**
`api/checkout.js` erweitern: Nach erfolgreicher zahls.ch-Zahlung (Webhook) ruft
eine Serverless-Function die **Order-API** des POD-Anbieters auf und legt den
Druckauftrag automatisch an. Gelato und Printful haben dafür saubere REST-APIs.
Aufwand: überschaubar (1–2 Tage Entwicklung), danach vollautomatisch. Empfohlen,
sobald das Volumen die Handarbeit lästig macht.

**Weg C — Merch auf WooCommerce lassen und POD-Plugin nutzen.**
`merch.inaya-soli.ch` läuft bereits auf WooCommerce. Dort das offizielle
Gelato-/Printful-Plugin installieren → **Nullcode, vollautomatisch**. Der React-Shop
verlinkt dann nur auf den Merch-Bereich. Das ist der geringste technische Aufwand
für Automatik, passt zur bereits getroffenen Entscheidung „Merch bleibt auf
WooCommerce". Nachteil: zwei Systeme (React-Hauptseite + WooCommerce-Merch).

---

## Kosten & P&L (Modellrechnung)

Annahmen: USD→CHF ≈ 0.89, zahls.ch-Gebühr 2.9 % + CHF 0.30, Versand pro Einzel-Shirt.
Zahlen sind Schätzungen – reale Grundpreise/Versand variieren nach Produktmodell,
Zielort und Tageskurs. Vor Scharfschaltung mit echten Katalogpreisen ersetzen.

### T-Shirt, Verkaufspreis CHF 30

| Szenario | POD-Kosten (Produkt+Versand) | Zahlungsgeb. | **Netto pro Shirt** | Marge |
|---|---|---|---|---|
| Printful FREE | ~CHF 16.0 | 1.17 | **~CHF 12.8** | 43 % |
| Printful Growth (−33 %) | ~CHF 12.5 | 1.17 | **~CHF 16.4** | 55 % |
| Printify FREE | ~CHF 13.2 | 1.17 | **~CHF 15.7** | 52 % |
| Printify Premium (−33 %) | ~CHF 10.7 | 1.17 | **~CHF 18.2** | 61 % |
| Gelato FREE (lokal) | ~CHF 16.5 | 1.17 | **~CHF 12.4** | 41 % |
| Gelato+ (−33 %, lokal) | ~CHF 12.5 | 1.17 | **~CHF 16.4** | 55 % |

Bei CHF 35 Verkaufspreis steigt die Netto-Marge auf ~CHF 17–18 pro Shirt (~50 %).

### Andere Artikel (illustrativ)
- **Stofftasche @ CHF 20:** Netto ~CHF 7.5 (38 %). Lohnt sich.
- **Sticker @ CHF 5:** Netto ~CHF 0.10 (2 %). **Über POD sinnlos** – Versand frisst
  die Marge. Sticker/Kleinartikel besser selbst drucken und mit Shirt-Bestellungen
  mitschicken oder als Gratis-Beilage nutzen.

### Fixkosten & Break-even des Rabatt-Abos
Mit **Free-Plan: CHF 0 Fixkosten** – ideal für den Start. Ein Rabatt-Abo (z. B.
Printful Growth ~CHF 22/Mt) bringt ~CHF 3.5 mehr Marge pro Shirt. Break-even:

> ~7 Shirts/Monat. Ab dann lohnt das Abo. Darunter beim Free-Plan bleiben.

(Printful Growth ist ohnehin ab $12k Jahresumsatz gratis.)

### Jahres-Beitrag an die Sache (Printful Free, ~CHF 12.8/Shirt netto)

| Absatz | Beitrag/Monat | Beitrag/Jahr |
|---|---|---|
| 5 Shirts/Mt | ~CHF 64 | ~CHF 770 |
| 20 Shirts/Mt | ~CHF 260 | ~CHF 3'070 |
| 50 Shirts/Mt | ~CHF 640 | ~CHF 7'690 |
| 100 Shirts/Mt | ~CHF 1'280 | ~CHF 15'370 |

Das „Profit" ist hier der Reinerlös, der der Organisation zufliesst. Kein
Lagerrisiko, keine Vorfinanzierung – jedes verkaufte Stück ist positiv.

---

## Empfehlung

1. **Anbieter: Gelato** als erste Wahl für einen Schweizer Shop – lokales
   Produktionsnetz (kürzere Wege, weniger Zoll-Ärger) und MwSt-Ausweis im Checkout.
   **Printful** als starke, gut dokumentierte Alternative (v. a. für Einzelstücke
   unter der CHF-62-Grenze). Beide vor Entscheid mit je einem **Musterdruck**
   (Sample) auf Qualität testen.
2. **Start: Free-Plan + Weg A (manuell).** Null Fixkosten, null Coderisiko. Erst
   umsteigen, wenn Volumen es rechtfertigt.
3. **Sortiment:** Shirts und Taschen ja, Kleinartikel wie Sticker **nicht** über
   POD (Marge zu klein).
4. **Preis:** CHF 30–35 pro Shirt hält die Einzelbestellung unter der
   CHF-62-Zollgrenze und liefert ~40–55 % Marge.
5. **Automatik später:** Bei steigendem Volumen entweder Weg B (API an
   `api/checkout.js`) oder Weg C (WooCommerce-Plugin auf `merch.inaya-soli.ch`).

## Offene Punkte / vor Scharfschaltung prüfen
- Echte Katalog-Grundpreise + Versandtarife des gewählten Anbieters einsetzen
  (Zahlen oben sind Schätzungen).
- Musterdruck bei Gelato **und** Printful bestellen, Qualität/Haptik vergleichen.
- MwSt-Status des Vereins mit Treuhand bestätigen (voraussichtlich befreit).
- SPOD/Spreadconnect Live-Preise nachtragen (am 21.07. nicht abrufbar).
- Entscheiden: React+zahls.ch (Weg A/B) **oder** WooCommerce-Merch (Weg C) als
  Merch-Kanal.

## Quellen (geprüft 21.07.2026)
- Printful Preise: https://www.printful.com/pricing
- Printify Preise: https://printify.com/pricing/
- Gelato Preise / Abos: https://www.gelato.com/pricing , https://www.gelato.com/subscription-plans
- zahls.ch Gebühren (aus Projektnotiz hosting-shop-options): 2.9 % + CHF 0.30
- Schweizer Bagatellgrenze Einfuhr-MwSt (Steuerbetrag ≤ CHF 5): BAZG/Zoll-Regel
