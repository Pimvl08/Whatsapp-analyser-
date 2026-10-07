# Voorbeeldofferte De Jongh Dak en Bouwservice

Demo voor acquisitie. Dit is geen echte offerte. Deze map hoort alleen op de
branch `demo/de-jongh` en mag niet naar de hoofdbranch, omdat het logo van een
ander bedrijf is.

## Bestanden

- `voorbeeldofferte-de-jongh.pdf`: de voorbeeldofferte (2 pagina's)
- `voorbeeldofferte-de-jongh-pagina1.png`: render van pagina 1 (150 dpi)
- `script/`: het script waarmee de PDF is gemaakt, met de offertegegevens in `quote.json`

## Bronnen bedrijfsgegevens

Gecontroleerd op 7 oktober 2026.

| Gegeven | Waarde in offerte | Bron |
| --- | --- | --- |
| Bedrijfsnaam | De Jongh Dak en Bouwservice | https://www.dejonghdakenbouw.nl/ (site en logo; "bv" staat niet op de site, dus weggelaten) |
| Adres | Duizeldonksestraat 1B, 5705 CA Helmond | https://www.dejonghdakenbouw.nl/contact (op de site staat 5705CA) |
| Telefoon | 06 43 43 91 75 | https://www.dejonghdakenbouw.nl/contact (op de site staat +31643439175, daarnaast 0492 - 779075) |
| E-mail | info@dejonghdakenbouw.nl | https://www.dejonghdakenbouw.nl/contact |
| Diensten | Dakbedekking (PVC, EPDM, bitumen, dakpannen), dakgoten, isolatie, onderhoud; eerst inspectie, dan offerte op maat | https://www.dejonghdakenbouw.nl/diensten |
| Naam en adres (controle) | Duizeldonksestraat 1B, Helmond | https://trustoo.nl/noord-brabant/helmond/dakgoot/de-jongh-dak-en-bouwservice/ |

KvK-nummer, btw-nummer en IBAN zijn bewust leeg gelaten. De site toont wel een
KvK-nummer, maar dat staat niet in de offerte.

## Bron logo

- URL: https://www.dejonghdakenbouw.nl/uploads/tnadPPQt/Bouwondernemingen-DeJongh-Helmond-logo.png
- Formaat: PNG, 960 x 736 px, RGB. Dit is het origineel achter de verkleinde
  versies op de site. Er is geen SVG gevonden.
- Het logo is niet bewerkt. OfferteVlot zet het zelf op 3x resolutie om naar PNG
  (2880 x 2208 px) en plaatst het op 22 x 17 mm.

## Klant en offerte

- Klant: "Voorbeeldklant", Voorbeeldstraat 1, Helmond (verzonnen, geen postcode).
- Offertenummer DEMO-001, datum 7 oktober 2026, geldig tot 6 november 2026.
- Klus: vervangen bitumen dakbedekking van een platte garage van circa 24 m² door EPDM met PIR-isolatie.

## Hoe de PDF is gemaakt

De PDF komt uit `generatePdf()` in `src/lib/pdf.ts` van OfferteVlot. De app zelf
is niet aangepast. Het script in `script/` bundelt die functie met esbuild en
draait hem in headless Chromium (Playwright).

Drie dingen kan de app nu niet zelf. Die regelt het script, alleen voor deze demo:

1. **Titel.** De titel "OFFERTE" staat vast in `pdf.ts`. `script/shim-jspdf.js`
   schrijft hem als "VOORBEELDOFFERTE".
2. **Demo-regel in de voettekst.** Na het genereren zet `script/entry.js` op elke
   pagina, op de lege tweede voetregel, de tekst "Voorbeeld gemaakt met OfferteVlot
   door PimWork (pimwork.nl). Geen echte offerte." Lettertype en kleur zijn die van
   de app.
3. **Overlap rechtsboven.** In `pdf.ts` staan de labels Offertenummer, Datum en
   Geldig tot op x = 154 mm, terwijl de waarden rechts zijn uitgelijnd. Een brede
   waarde loopt daardoor over het label heen. Bij "6 november 2026" overlappen ze
   3,3 mm, en ook het standaardnummer OF-2026-001 is te breed. De shim zet alleen
   die labels op x = 136 mm.

Bugs in de app die nog opgelost moeten worden:

- De overlap van labels en waarden rechtsboven (punt 3 hierboven).
- De voorwaarden worden te smal afgebroken. `splitTextToSize` voor de voorwaarden
  rekent met lettergrootte 13 (die van het totaalbedrag), terwijl de tekst op 8,6
  wordt geschreven. Er wordt niets afgekapt, de regels zijn alleen korter dan nodig.

Opnieuw maken (vanuit `demos/de-jongh/script/`):

```bash
node bundle.mjs && python3 run.py <pad-naar-logo.png> ../voorbeeldofferte-de-jongh.pdf
```
