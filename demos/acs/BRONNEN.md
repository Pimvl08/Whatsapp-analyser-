# Voorbeeldofferte ACS Ad Chatrer Schilderwerken

Demo voor acquisitie, om aan Ad Chatrer zelf te laten zien. Dit is geen echte
offerte. Deze map hoort alleen op de branch `demo/acs` en mag niet naar de
hoofdbranch, omdat het logo van een ander bedrijf is.

## Bestanden

- `voorbeeldofferte-acs.pdf`: de voorbeeldofferte (2 pagina's)
- `voorbeeldofferte-acs-pagina1.png`: render van pagina 1 (150 dpi)
- `script/`: het script waarmee de PDF is gemaakt, met de offertegegevens in `quote.json`

## Bronnen bedrijfsgegevens

Gecontroleerd op 7 oktober 2026 op de eigen site van het bedrijf.

| Gegeven | Waarde in offerte | Bron |
| --- | --- | --- |
| Bedrijfsnaam | ACS Ad Chatrer Schilderwerken | Paginatitel van https://www.acs-schilderwerken.nl/ ("ACS - Ad Chatrer Schilderwerken") en het logo; op de contactpagina staat "Ad Chatrer Schilderwerken" |
| Adres | Spechtstraat 10, 5735 EL Aarle-Rixtel | https://www.acs-schilderwerken.nl/?pagina=contact (daar in hoofdletters: AARLE-RIXTEL) |
| Telefoon | 0492 38 32 33 / 06 28 42 24 28 | Contactpagina (daar: Tel: 0492-383233, Mob: 06-28422428). De app heeft één telefoonveld, dus beide nummers staan daarin |
| E-mail | acs@onsmail.nl | Contactpagina |
| Website | www.acs-schilderwerken.nl | Genoemd in de voorwaarden, bij de algemene leveringsvoorwaarden |
| Ervaring | Meer dan 30 jaar schilder, eigen bedrijf sinds 03-03-2008 | https://www.acs-schilderwerken.nl/?pagina=overACS (niet in de offerte gebruikt) |
| Diensten | Binnen- en buitenschilderwerk, machinaal schuren met stofafzuiging, kitvoegen, kleine houtrotreparaties met epoxypasta en kleine deelvervangingen, kleuradvies, glansgraad mat/zijdeglans/halfglans/hoogglans | https://www.acs-schilderwerken.nl/?pagina=schilderen |
| Btw-regeling | 9% voor woningen ouder dan 2 jaar bewoond door particulieren, 21% voor bedrijfspanden, schriftelijke verklaring van de opdrachtgever nodig | https://www.acs-schilderwerken.nl/?pagina=btw |
| Algemene leveringsvoorwaarden | Er wordt naar verwezen, niet bijgevoegd | Link op de contactpagina: http://www.acs-schilderwerken.nl/acsalgemeneleveringsvoorwaarden.pdf |

KvK-nummer, btw-nummer en IBAN zijn bewust leeg gelaten. De contactpagina toont
wel KvK en btw-nummer, maar die staan niet in de offerte.

## Bron logo

- URL: https://www.acs-schilderwerken.nl/img/logo.png (dezelfde afbeelding die
  in de kop van elke pagina van de site staat; er is geen grotere versie of SVG
  gevonden)
- Formaat: PNG, 772 x 229 px, RGBA (transparante achtergrond), 44.613 bytes,
  laatst gewijzigd op de server op 19 januari 2017.
  SHA-256: f337b69722dec4695c12c77708ad9803be56c3971415823ef2c19a0f28e4c57b
- Het logo is niet bewerkt. OfferteVlot zet het zelf op 3x resolutie om naar PNG
  (2316 x 687 px) en plaatst het op 42 x 12,5 mm. Dat is ongeveer 465 ppi uit het
  bronbestand, dus ruim scherp genoeg voor print. Het bronbestand heeft zelf licht
  getrapte randen; die zie je alleen bij sterk inzoomen.
- Het logo is breed (3,4 : 1). Daardoor wordt het in OfferteVlot door de maximale
  breedte van 42 mm begrensd en oogt het wat kleiner dan het logo van De Jongh.
  Het is niet groter gezet, want dat kan alleen door de app aan te passen.

## Btw-tarief

OfferteVlot ondersteunt een btw-tarief per offerte: 21%, 9% of 0%
(`VatRate = 21 | 9 | 0` in `src/types.ts`, knoppen in `src/components/LineItems.tsx`).
Niet per regel, maar dat is hier ook niet nodig: alle regels zijn schilderwerk
aan een particuliere woning. Deze offerte gebruikt dus gewoon 9%, zonder iets
aan de app te veranderen. In de PDF staat "BTW (9%)".

In de voorwaarden staat letterlijk: "Opdrachtgever verklaart dat de woning ouder
is dan 2 jaar en door een particulier wordt bewoond, zodat het 9%-btw-tarief van
toepassing is." Dat is de laatste alinea, direct boven het vak voor de
handtekening van de opdrachtgever.

## Klant en offerte

- Klant: "Voorbeeldklant", Voorbeeldstraat 1, Aarle-Rixtel (verzonnen, geen postcode).
- Offertenummer DEMO-002, datum 7 oktober 2026, geldig tot 6 november 2026 (30 dagen).
- Klus: buitenschilderwerk van een rijtjeswoning, kozijnen, ramen en boeidelen
  voor en achter (78 m¹) plus de voordeur.

| Regel | Aantal | Prijs | Totaal |
| --- | --- | --- | --- |
| Voorbereiden: reinigen, ontvetten, machinaal schuren met stofafzuiging | 78 m¹ | € 6,00 | € 468,00 |
| Kitvoegen glas/hout vernieuwen, incl. kit | 46 m¹ | € 8,50 | € 391,00 |
| Stelpost houtrotreparaties met epoxy | 4 stuks | € 55,00 | € 220,00 |
| Bijwerken en gronden kale plekken | 1 post | € 145,00 | € 145,00 |
| Aflakken zijdeglans (2 lagen), incl. verf | 78 m¹ | € 11,50 | € 897,00 |
| Voordeur met kozijn, buitenzijde | 1 stuks | € 195,00 | € 195,00 |
| Ladder- en steigerwerk, incl. rolsteiger | 1 post | € 165,00 | € 165,00 |
| **Subtotaal** | | | **€ 2.481,00** |
| **Btw 9%** | | | **€ 223,29** |
| **Totaal incl. btw** | | | **€ 2.704,29** |

Prijzen zijn een inschatting van wat in Zuidoost-Brabant gangbaar is (uurloon
schilder rond € 50 tot € 55 ex btw, compleet buitenschilderwerk rond € 20 tot
€ 25 per m¹ kozijnhout inclusief voorbereiding). Het subtotaal is bewust een
rond bedrag, zodat 9% btw precies op hele centen uitkomt.

## Hoe de PDF is gemaakt

Zelfde werkwijze en hetzelfde script als de demo voor De Jongh (branch
`demo/de-jongh`). Alleen `quote.json` is nieuw; `bundle.mjs`, `entry.js`,
`run.py` en `shim-jspdf.js` zijn ongewijzigd overgenomen.

De PDF komt uit `generatePdf()` in `src/lib/pdf.ts` van OfferteVlot. De app zelf
is niet aangepast. Het script bundelt die functie met esbuild en draait hem in
headless Chromium (Playwright). Daarna:

1. **Titel.** "OFFERTE" wordt geschreven als "VOORBEELDOFFERTE" (`shim-jspdf.js`),
   in het lettertype en de kleur van de app. De app zet de titel alleen op pagina 1.
2. **Demo-regel.** Op elke pagina staat op de lege tweede voetregel "Voorbeeld
   gemaakt met OfferteVlot door PimWork (pimwork.nl). Geen echte offerte."
   (`entry.js`), in het lettertype en de kleur van de app.
3. **Labels rechtsboven** staan op x = 136 mm, zodat ze niet over de waarden
   lopen (bekende bug, zie hieronder).

## Controle

- Alle regelbedragen, subtotaal, btw en totaal nagerekend en teruggevonden in de
  PDF-tekst. Nergens 21%.
- "Pagina 1 van 2" en "Pagina 2 van 2" kloppen; de demo-regel staat op beide pagina's.
- Geen tekst buiten de marges, geen em-streepjes, geen KvK, btw-nummer of IBAN.
- Logo op 500 dpi bekeken: zo scherp als het bronbestand.

## Bugs in de app (nog oplossen, niet in deze demo)

- **Nieuw gevonden:** omschrijvingen in de tabel kunnen tegen de kolom Aantal
  aanlopen. `DESC_MAX_W` rekent vanaf x = 18 mm, maar de tekst begint op 20 mm,
  en een getal van twee cijfers begint al rond 122 mm. Een volle eerste regel
  eindigt dan vlak voor of tegen het aantal ("vernieuwen,46"). In deze demo
  opgelost door twee omschrijvingen anders te formuleren; elke regel heeft nu
  minstens 3 mm ruimte.
- De overlap van labels en waarden rechtsboven (zie De Jongh).
- De voorwaarden worden te smal afgebroken (rekent met lettergrootte 13 in
  plaats van 8,6). Niets afgekapt, de regels zijn alleen korter dan nodig.

## Opnieuw maken

Vanuit `demos/acs/script/`, met `node_modules` van de app in de repo-root en
Python met Playwright:

```bash
node bundle.mjs && python3 run.py <pad-naar-logo.png> ../voorbeeldofferte-acs.pdf
```
