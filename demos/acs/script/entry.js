import { generatePdf } from '../../../src/lib/pdf.ts'
import { computeTotals } from '../../../src/lib/calc.ts'

const FOOTER_Y = 281 // same as src/lib/pdf.ts
const ML = 18
const NOTE = 'Voorbeeld gemaakt met OfferteVlot door PimWork (pimwork.nl). Geen echte offerte.'

window.makeDemo = async (quote) => {
  const doc = await generatePdf(quote)
  // Demo note on the free second footer line of every page (KvK/BTW/IBAN are empty).
  const pages = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i)
    doc.setFont('helvetica', 'italic')
    doc.setFontSize(7.5)
    doc.setTextColor(68, 80, 95)
    doc.text(NOTE, ML, FOOTER_Y + 8.5)
  }
  const buf = doc.output('arraybuffer')
  let bin = ''
  const bytes = new Uint8Array(buf)
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i])
  return { pdf: btoa(bin), pages, totals: computeTotals(quote) }
}
