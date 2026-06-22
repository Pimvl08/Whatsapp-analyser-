import type { QuoteHistoryEntry } from '../types'

const HISTORY_KEY = 'offertevlot.history.v1'
const SEQ_KEY = 'offertevlot.seq.v1'

export function loadHistory(): QuoteHistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveHistory(entries: QuoteHistoryEntry[]): void {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(entries.slice(0, 50)))
  } catch {
    /* storage full or unavailable — non-fatal for the demo */
  }
}

/** Returns the next sequential counter without consuming it. */
export function peekSequence(): number {
  try {
    const raw = localStorage.getItem(SEQ_KEY)
    const n = raw ? parseInt(raw, 10) : 0
    return Number.isFinite(n) ? n + 1 : 1
  } catch {
    return 1
  }
}

/** Consumes and persists the sequence counter, returning the new value. */
export function bumpSequence(): number {
  const next = peekSequence()
  try {
    localStorage.setItem(SEQ_KEY, String(next))
  } catch {
    /* ignore */
  }
  return next
}

export function formatQuoteNumber(seq: number, year = new Date().getFullYear()): string {
  return `OF-${year}-${String(seq).padStart(3, '0')}`
}
