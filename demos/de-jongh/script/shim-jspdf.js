// Wraps the real jsPDF for this demo only; src/lib/pdf.ts stays untouched.
// 1. The hard-coded title 'OFFERTE' is written as 'VOORBEELDOFFERTE'.
// 2. The meta labels top right (drawn at x = CONTENT_R - 38 = 154 mm) are moved
//    to x = 136 mm, so they no longer overlap their right-aligned values.
import { jsPDF as RealJsPDF } from 'jspdf'

const META_LABELS = new Set(['Offertenummer', 'Datum', 'Geldig tot'])
const META_LABEL_X = 154
const META_LABEL_X_FIXED = 136

export function jsPDF(...args) {
  const doc = new RealJsPDF(...args)
  const text = doc.text.bind(doc)
  doc.text = (t, x, ...rest) => {
    if (t === 'OFFERTE') t = 'VOORBEELDOFFERTE'
    if (META_LABELS.has(t) && x === META_LABEL_X) x = META_LABEL_X_FIXED
    return text(t, x, ...rest)
  }
  return doc
}
