# OfferteVlot — Offerte-PDF-Generator

Een client-side webapp waarmee aannemers en dakdekkers in enkele minuten een
gepolijste, print-klare offerte-PDF maken. Geen backend, geen account — alles
draait in de browser.

## Functionaliteit

- **Bedrijfsgegevens** met drag & drop logo-upload (PNG/JPG/SVG), verwerkt in
  de header en footer van de PDF.
- **Klantgegevens** inclusief apart klusadres.
- **Dynamische offerteregels**: omschrijving, aantal, eenheid, stukprijs met
  automatische regel- en eindtotalen. Regels toevoegen, verwijderen en
  herordenen.
- **Btw-keuze** (21% / 9% / 0%) en een optionele korting (percentage of vast
  bedrag).
- **Automatisch offertenummer** (`OF-2026-001`, oplopend), offertedatum en een
  geldigheidsdatum van standaard +30 dagen.
- **Live voorbeeld** dat exact meebeweegt met de uiteindelijke PDF.
- **Voorbeeld laden** vult in één klik een complete, realistische
  dakrenovatie-offerte — ideaal tijdens een belafspraak of bezoek.
- **Download PDF**: print-klaar A4 met nette marges, gegenereerd als scherpe
  vectortekst (jsPDF).
- **Verstuur via WhatsApp**: opent WhatsApp met een nette begeleidende tekst.
- **Historie** van eerder gemaakte offertes binnen de sessie (localStorage).

## Tech stack

React + Vite + TypeScript + Tailwind CSS, PDF-generatie met jsPDF. Single-page,
geen routing. Werkt op desktop en mobiel.

## Aan de slag

```bash
npm install
npm run dev      # ontwikkelserver
npm run build    # productie-build naar dist/
npm run preview  # bekijk de productie-build lokaal
```
