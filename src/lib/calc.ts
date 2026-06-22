import type { Quote, LineItem } from '../types'

export function lineTotal(item: LineItem): number {
  return (Number(item.qty) || 0) * (Number(item.price) || 0)
}

export interface Totals {
  subtotal: number
  discount: number
  taxableBase: number
  vat: number
  total: number
}

export function computeTotals(quote: Quote): Totals {
  const subtotal = quote.items.reduce((sum, it) => sum + lineTotal(it), 0)

  let discount = 0
  if (quote.discountEnabled && quote.discountValue > 0) {
    discount =
      quote.discountType === 'percent'
        ? (subtotal * quote.discountValue) / 100
        : quote.discountValue
  }
  discount = Math.min(discount, subtotal)

  const taxableBase = subtotal - discount
  const vat = (taxableBase * quote.vatRate) / 100
  const total = taxableBase + vat

  return { subtotal, discount, taxableBase, vat, total }
}
