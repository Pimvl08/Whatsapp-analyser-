import { jsPDF } from 'jspdf'
import type { Quote } from '../types'
import { computeTotals, lineTotal } from './calc'
import { formatEuro, formatNumber, formatDateNL } from './format'

// ---- Palette (RGB) ---------------------------------------------------------
const INK: [number, number, number] = [22, 35, 58]
const INK_SOFT: [number, number, number] = [68, 80, 95]
const MUTED: [number, number, number] = [138, 149, 163]
const ACCENT: [number, number, number] = [201, 154, 85]
const HAIR: [number, number, number] = [223, 227, 233]
const ROW_ALT: [number, number, number] = [247, 248, 250]
const TINT: [number, number, number] = [244, 240, 232]

// ---- Page geometry (mm) ----------------------------------------------------
const PW = 210
const ML = 18
const MR = 18
const CONTENT_R = PW - MR
const FOOTER_Y = 281
const BODY_BOTTOM = 268 // last y at which body content may start

// Table columns (x edges in mm)
const COL_DESC_X = ML
const COL_QTY_R = 126
const COL_UNIT_X = 130
const COL_PRICE_R = 170
const COL_TOTAL_R = CONTENT_R
const DESC_MAX_W = COL_QTY_R - 6 - COL_DESC_X

/** Rasterise any image data URL (incl. SVG) to PNG so jsPDF can embed it. */
function rasterise(
  dataUrl: string,
): Promise<{ png: string; w: number; h: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const scale = 3 // crisp on print
      const w = img.naturalWidth || 240
      const h = img.naturalHeight || 240
      const canvas = document.createElement('canvas')
      canvas.width = w * scale
      canvas.height = h * scale
      const ctx = canvas.getContext('2d')
      if (!ctx) return reject(new Error('no canvas context'))
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      resolve({ png: canvas.toDataURL('image/png'), w, h })
    }
    img.onerror = () => reject(new Error('image load failed'))
    img.src = dataUrl
  })
}

function setColor(doc: jsPDF, c: [number, number, number]) {
  doc.setTextColor(c[0], c[1], c[2])
}
function setFill(doc: jsPDF, c: [number, number, number]) {
  doc.setFillColor(c[0], c[1], c[2])
}
function setDraw(doc: jsPDF, c: [number, number, number]) {
  doc.setDrawColor(c[0], c[1], c[2])
}

export async function generatePdf(quote: Quote): Promise<jsPDF> {
  const doc = new jsPDF({ unit: 'mm', format: 'a4', compress: true })
  doc.setFont('helvetica', 'normal')
  const totals = computeTotals(quote)
  const c = quote.company
  const cust = quote.customer

  let logo: { png: string; w: number; h: number } | null = null
  if (c.logo) {
    try {
      logo = await rasterise(c.logo)
    } catch {
      logo = null
    }
  }

  let pageNo = 0

  // The footer is drawn per page, but the page number is stamped in a final
  // pass once the total page count is known (see "Stamp page numbers" below).
  const drawFooter = () => {
    setDraw(doc, HAIR)
    doc.setLineWidth(0.3)
    doc.line(ML, FOOTER_Y, CONTENT_R, FOOTER_Y)
    doc.setFontSize(7.5)
    doc.setFont('helvetica', 'normal')
    setColor(doc, MUTED)
    const left = [c.name, c.phone, c.email].filter(Boolean).join('   ·   ')
    doc.text(left || ' ', ML, FOOTER_Y + 4.5)
    const right = [
      c.kvk && `KvK ${c.kvk}`,
      c.vat && `BTW ${c.vat}`,
      c.iban && `IBAN ${c.iban}`,
    ]
      .filter(Boolean)
      .join('   ·   ')
    doc.text(right || ' ', ML, FOOTER_Y + 8.5)
  }

  const newPage = (first: boolean) => {
    if (!first) doc.addPage()
    pageNo += 1
    drawFooter()
  }

  // ---- Page 1 header -------------------------------------------------------
  newPage(true)
  let y = 20

  // Logo + company name (left)
  let headerLeftBottom = y
  if (logo) {
    const maxH = 17
    const maxW = 42
    let lw = (logo.w / logo.h) * maxH
    let lh = maxH
    if (lw > maxW) {
      lw = maxW
      lh = (logo.h / logo.w) * maxW
    }
    doc.addImage(logo.png, 'PNG', ML, y, lw, lh, undefined, 'FAST')
    headerLeftBottom = y + lh
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    setColor(doc, INK)
    if (c.name) doc.text(c.name, ML, headerLeftBottom + 6)
    headerLeftBottom += c.name ? 6 : 0
  } else {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(19)
    setColor(doc, INK)
    doc.text(c.name || 'Uw bedrijfsnaam', ML, y + 6)
    headerLeftBottom = y + 6
  }

  // Quote title block (right)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(24)
  setColor(doc, INK)
  doc.text('OFFERTE', CONTENT_R, y + 4, { align: 'right' })
  // accent underline tick
  setFill(doc, ACCENT)
  doc.rect(CONTENT_R - 26, y + 6.4, 26, 1.4, 'F')

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9.5)
  const metaRows: [string, string][] = [
    ['Offertenummer', quote.number],
    ['Datum', formatDateNL(quote.date)],
    ['Geldig tot', formatDateNL(quote.validUntil)],
  ]
  let my = y + 14
  metaRows.forEach(([label, val]) => {
    setColor(doc, MUTED)
    doc.text(label, CONTENT_R - 38, my, { align: 'left' })
    setColor(doc, INK)
    doc.setFont('helvetica', 'bold')
    doc.text(val || '—', CONTENT_R, my, { align: 'right' })
    doc.setFont('helvetica', 'normal')
    my += 5.5
  })

  y = Math.max(headerLeftBottom, my) + 6

  // Header hairline
  setDraw(doc, HAIR)
  doc.setLineWidth(0.4)
  doc.line(ML, y, CONTENT_R, y)
  y += 9

  // ---- Customer + company address blocks -----------------------------------
  const colRX = 118
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  setColor(doc, ACCENT)
  doc.text('OFFERTE VOOR', ML, y)
  doc.text('VAN', colRX, y)

  doc.setFontSize(10.5)
  setColor(doc, INK)
  doc.setFont('helvetica', 'bold')
  doc.text(cust.name || '—', ML, y + 6)
  doc.text(c.name || '—', colRX, y + 6)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9.5)
  setColor(doc, INK_SOFT)
  let ly = y + 11.5
  let ry = y + 11.5
  const lineH = 4.6

  const custAddr = (cust.address || '').split('\n').filter(Boolean)
  custAddr.forEach((l) => {
    doc.text(l, ML, ly)
    ly += lineH
  })
  if (!cust.sameAddress && cust.jobAddress.trim()) {
    ly += 1
    setColor(doc, MUTED)
    doc.setFontSize(8.5)
    doc.text('Werkadres', ML, ly)
    ly += 4
    setColor(doc, INK_SOFT)
    doc.setFontSize(9.5)
    cust.jobAddress
      .split('\n')
      .filter(Boolean)
      .forEach((l) => {
        doc.text(l, ML, ly)
        ly += lineH
      })
  }
  if (cust.phone) {
    doc.text(cust.phone, ML, ly)
    ly += lineH
  }
  if (cust.email) {
    doc.text(cust.email, ML, ly)
    ly += lineH
  }

  const compAddr = (c.address || '').split('\n').filter(Boolean)
  compAddr.forEach((l) => {
    doc.text(l, colRX, ry)
    ry += lineH
  })
  if (c.phone) {
    doc.text(c.phone, colRX, ry)
    ry += lineH
  }
  if (c.email) {
    doc.text(c.email, colRX, ry)
    ry += lineH
  }

  y = Math.max(ly, ry) + 8

  // ---- Intro --------------------------------------------------------------
  if (quote.intro.trim()) {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9.7)
    setColor(doc, INK_SOFT)
    const introLines = doc.splitTextToSize(quote.intro.trim(), CONTENT_R - ML)
    introLines.forEach((l: string) => {
      if (y > BODY_BOTTOM) {
        newPage(false)
        y = 22
      }
      doc.text(l, ML, y, { lineHeightFactor: 1.4 })
      y += 5
    })
    y += 5
  }

  // ---- Line items table ----------------------------------------------------
  const drawTableHeader = () => {
    setFill(doc, INK)
    doc.rect(ML, y, CONTENT_R - ML, 9, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.setTextColor(255, 255, 255)
    const ty = y + 5.9
    doc.text('OMSCHRIJVING', COL_DESC_X + 2, ty)
    doc.text('AANTAL', COL_QTY_R, ty, { align: 'right' })
    doc.text('EENH.', COL_UNIT_X, ty)
    doc.text('STUKPRIJS', COL_PRICE_R, ty, { align: 'right' })
    doc.text('TOTAAL', COL_TOTAL_R - 2, ty, { align: 'right' })
    y += 9
  }

  drawTableHeader()

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9.5)
  let rowIndex = 0
  for (const item of quote.items) {
    const descLines = doc.splitTextToSize(
      item.description || '—',
      DESC_MAX_W,
    ) as string[]
    const rowH = Math.max(9, descLines.length * 4.6 + 4)

    if (y + rowH > BODY_BOTTOM) {
      newPage(false)
      y = 22
      drawTableHeader()
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9.5)
    }

    if (rowIndex % 2 === 1) {
      setFill(doc, ROW_ALT)
      doc.rect(ML, y, CONTENT_R - ML, rowH, 'F')
    }

    const baseY = y + 5.6
    setColor(doc, INK)
    descLines.forEach((l, i) => {
      doc.text(l, COL_DESC_X + 2, baseY + i * 4.6)
    })
    setColor(doc, INK_SOFT)
    doc.text(formatNumber(item.qty), COL_QTY_R, baseY, { align: 'right' })
    doc.text(item.unit, COL_UNIT_X, baseY)
    doc.text(formatEuro(item.price), COL_PRICE_R, baseY, { align: 'right' })
    doc.setFont('helvetica', 'bold')
    setColor(doc, INK)
    doc.text(formatEuro(lineTotal(item)), COL_TOTAL_R - 2, baseY, {
      align: 'right',
    })
    doc.setFont('helvetica', 'normal')

    y += rowH
    setDraw(doc, HAIR)
    doc.setLineWidth(0.2)
    doc.line(ML, y, CONTENT_R, y)
    rowIndex += 1
  }

  y += 6

  // ---- Totals block (right aligned) ----------------------------------------
  const totalsX = 116
  const totalsW = CONTENT_R - totalsX
  const labelX = totalsX + 3
  const valX = CONTENT_R - 3
  const rows: [string, string, boolean][] = [
    ['Subtotaal', formatEuro(totals.subtotal), false],
  ]
  if (quote.discountEnabled && totals.discount > 0) {
    const lbl =
      quote.discountType === 'percent'
        ? `Korting (${formatNumber(quote.discountValue)}%)`
        : 'Korting'
    rows.push([lbl, '- ' + formatEuro(totals.discount), false])
    rows.push(['Subtotaal na korting', formatEuro(totals.taxableBase), false])
  }
  rows.push([`BTW (${quote.vatRate}%)`, formatEuro(totals.vat), false])

  const totalsHeight = rows.length * 6.5 + 14
  if (y + totalsHeight > BODY_BOTTOM) {
    newPage(false)
    y = 22
  }

  doc.setFontSize(9.7)
  rows.forEach(([label, val]) => {
    doc.setFont('helvetica', 'normal')
    setColor(doc, INK_SOFT)
    doc.text(label, labelX, y)
    doc.setFont('helvetica', 'bold')
    setColor(doc, INK)
    doc.text(val, valX, y, { align: 'right' })
    y += 6.5
  })
  y += 1.5

  // Total band
  setFill(doc, INK)
  doc.roundedRect(totalsX, y, totalsW, 12, 1.6, 1.6, 'F')
  setFill(doc, ACCENT)
  doc.rect(totalsX, y, 1.6, 12, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(255, 255, 255)
  doc.text('Totaal incl. btw', labelX, y + 7.6)
  doc.setFontSize(13)
  setColor(doc, ACCENT)
  doc.text(formatEuro(totals.total), valX, y + 7.8, { align: 'right' })
  y += 12 + 12

  // ---- Terms ---------------------------------------------------------------
  if (quote.terms.trim()) {
    const termsLines = doc.splitTextToSize(
      quote.terms.trim(),
      CONTENT_R - ML,
    ) as string[]
    const blockH = termsLines.length * 4.3 + 12
    if (y + blockH > BODY_BOTTOM) {
      newPage(false)
      y = 22
    }
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    setColor(doc, ACCENT)
    doc.text('VOORWAARDEN', ML, y)
    y += 5.5
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8.6)
    setColor(doc, INK_SOFT)
    termsLines.forEach((l) => {
      if (y > BODY_BOTTOM) {
        newPage(false)
        y = 22
      }
      doc.text(l, ML, y)
      y += 4.3
    })
    y += 6
  }

  // ---- Acceptance / signature ---------------------------------------------
  const sigH = 26
  if (y + sigH > BODY_BOTTOM) {
    newPage(false)
    y = 24
  }
  setFill(doc, TINT)
  doc.roundedRect(ML, y, CONTENT_R - ML, sigH, 2, 2, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8.5)
  setColor(doc, INK)
  doc.text('Akkoord met deze offerte?', ML + 5, y + 7)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.2)
  setColor(doc, INK_SOFT)
  doc.text(
    'Onderteken hieronder en stuur de offerte retour. Wij plannen direct een datum met u in.',
    ML + 5,
    y + 12,
  )
  setDraw(doc, MUTED)
  doc.setLineWidth(0.3)
  const sigLineY = y + sigH - 6
  doc.line(ML + 5, sigLineY, ML + 70, sigLineY)
  doc.line(CONTENT_R - 70, sigLineY, CONTENT_R - 5, sigLineY)
  doc.setFontSize(7.5)
  setColor(doc, MUTED)
  doc.text('Handtekening opdrachtgever', ML + 5, sigLineY + 4)
  doc.text('Datum', CONTENT_R - 70, sigLineY + 4)

  // ---- Stamp page numbers --------------------------------------------------
  // Now that every page exists we know the total, so we can draw an accurate
  // "Pagina X van Y" on each page (no placeholder needed).
  const internal = doc.internal as unknown as {
    getNumberOfPages: () => number
  }
  const pages = internal.getNumberOfPages()
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.5)
    setColor(doc, MUTED)
    doc.text(`Pagina ${i} van ${pages}`, CONTENT_R, FOOTER_Y + 8.5, {
      align: 'right',
    })
  }

  return doc
}

export async function downloadPdf(quote: Quote): Promise<void> {
  const doc = await generatePdf(quote)
  const safeName = (quote.customer.name || 'klant')
    .replace(/[^\w\sÀ-ÿ-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
  doc.save(`${quote.number}_${safeName || 'offerte'}.pdf`)
}

export async function getPdfBlobUrl(quote: Quote): Promise<string> {
  const doc = await generatePdf(quote)
  const blob = doc.output('blob')
  return URL.createObjectURL(blob)
}
