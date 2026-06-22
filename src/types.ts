export interface Company {
  name: string
  logo: string | null // data URL
  address: string
  kvk: string
  vat: string
  phone: string
  email: string
  iban: string
}

export interface Customer {
  name: string
  address: string
  jobAddress: string
  sameAddress: boolean
  phone: string
  email: string
}

export type Unit = 'm²' | 'm¹' | 'stuks' | 'uur' | 'dag' | 'post' | 'set'

export interface LineItem {
  id: string
  description: string
  qty: number
  unit: Unit
  price: number
}

export type VatRate = 21 | 9 | 0
export type DiscountType = 'percent' | 'amount'

export interface Quote {
  id: string
  number: string
  date: string // ISO yyyy-mm-dd
  validUntil: string // ISO yyyy-mm-dd
  intro: string
  terms: string
  vatRate: VatRate
  discountEnabled: boolean
  discountType: DiscountType
  discountValue: number
  items: LineItem[]
  company: Company
  customer: Customer
}

export interface QuoteHistoryEntry {
  id: string
  number: string
  date: string
  customerName: string
  total: number
  savedAt: number
  snapshot: Quote
}
