# INAYA – Nächste Schritte

Laufend aktualisierte Liste. Status anpassen, sobald erledigt (offen / in Arbeit / erledigt).

| # | Schritt | Priorität | Status | Notiz |
|---|---|---|---|---|
| 9 | Opener in `website-zu` committen | hoch | offen | `opener.html` erstellt/gespeichert, aber Commit im Sandbox nicht möglich: stale Locks vom 06.07. (`.git/HEAD.lock`, `.git/index.lock`, `.git/refs/heads/master.lock`) lassen sich im Mount nicht löschen ("Operation not permitted") – gleiches Problem wie Schritt 1. Lokal ausführen: `cd website-zu && rm -f .git/HEAD.lock .git/index.lock .git/refs/heads/master.lock && git add opener.html && git commit -m "Add animated eye/star city opener"` |
| 9b | Opener-Änderungen in `website-react` committen | mittel | offen | Falls auch die React-Variante versioniert werden soll: `cd website-react && rm -f .git/HEAD.lock .git/index.lock && git add -A && git commit -m "Add animated city opener as landing route"` (CityOpener.jsx + App/Layout/index.css/index.html) |
| 1 | Git-Repo für inaya-soli.ch/zu einrichten | hoch | in Arbeit | Lokal in `website-zu/` angelegt, erster Commit erfolgt. Offen: Branch lokal von `master` auf `main` umbenennen, Stale Lock-File `.git/refs/heads/master.lock` von Hand löschen (im Sandbox-Mount nicht löschbar), danach GitHub-Remote einrichten |
| 2 | Mehrsprachigkeit: bereits vorhandene Übersetzungen mit der Website verlinken | hoch | offen | Überraschender Fund im cyon-Export: Es existieren bereits fertige Sprachordner (ar, de, en, es, fa, fr, it, ku, ru, tu, al) unter `zu/`, aber der Sprachlink im Menü der Live-Seite führt nirgendwo hin. D.h. Mehrsprachigkeit ist grösstenteils schon gebaut, nur nicht verlinkt/gepflegt – vor „neu bauen“ prüfen, ob diese Ordner aktuell/korrekt sind |
| 3 | Bugs fixen: `<a herf="">`-Tippfehler, ungültige `top-600`-Klasse im Popup, fehlendes `lang="de"` im `<html>`-Tag | hoch | offen | Kleine, risikoarme Fixes |
| 4 | „Aktuelle Informationen“-Block auf der Startseite aktualisieren | hoch | offen | Zeigt aktuell „Aktuell nichts Neues“ – neuen Inhalt oder Kampagnen-Rückblick einpflegen |
| 5 | Zugangsdaten aus Übergabedokument prüfen | mittel | offen | Wer hat noch Zugriff, ggf. Passwörter rotieren |
| 6 | Bilder mit `width`/`height` versehen, grosse Bilder komprimieren | mittel | offen | Verhindert Layout-Sprünge; einige Bilder sind unnötig gross (z.B. `Inaya_Kalender.png` ~32 MB pro Sprache) |
| 7 | Externe CDN-Abhängigkeiten reduzieren (Tailwind CDN, Alpine CDN, Google Fonts, Reframe.js) | niedrig | offen | Performance, relevant bei wenig Datenvolumen |
| 8 | Wiederkehrende Routine für Zahls.ch-Bestellreporting einrichten | niedrig | offen | Aktueller WooCommerce-Export unbefriedigend |
| 9 | Print-on-Demand / Dropshipping für Merch evaluieren | mittel | in Arbeit | Optionen, Kosten & P&L recherchiert → `docs/dropshipping-pod-optionen-2026-07-21.md`. Empfehlung: Start mit Gelato oder Printful, Free-Plan + manuelle Erfüllung. Offen: Musterdruck bestellen, echte Katalogpreise einsetzen, MwSt-Status Verein bestätigen |
