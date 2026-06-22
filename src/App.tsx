import { useEffect, useMemo, useState } from 'react'
import type {
  Quote,
  Company,
  Customer,
  LineItem,
  QuoteHistoryEntry,
} from './types'
import { createEmptyQuote, createSampleQuote } from './sampleData'
import { computeTotals } from './lib/calc'
import { formatEuro } from './lib/format'
import { downloadPdf } from './lib/pdf'
import {
  loadHistory,
  saveHistory,
  bumpSequence,
  formatQuoteNumber,
  peekSequence,
} from './lib/storage'

import Section from './components/Section'
import CompanyForm from './components/CompanyForm'
import CustomerForm from './components/CustomerForm'
import LineItems from './components/LineItems'
import MetaForm from './components/MetaForm'
import PreviewPane from './components/PreviewPane'
import HistoryDrawer from './components/HistoryDrawer'
import {
  Sparkles,
  Download,
  Whatsapp,
  HistoryIcon,
  Eye,
  Pencil,
  Check,
} from './components/icons'

function buildWhatsappUrl(quote: Quote): string {
  const total = formatEuro(computeTotals(quote).total)
  const firstName = quote.customer.name || 'daar'
  const company = quote.company.name || 'ons bedrijf'
  const msg =
    `Beste ${firstName},\n\n` +
    `Hierbij ontvangt u offerte ${quote.number} van ${company} voor een totaalbedrag van ${total} incl. btw. ` +
    `De volledige offerte stuur ik als PDF mee.\n\n` +
    `Heeft u vragen of wilt u een afspraak inplannen? Laat het gerust weten.\n\n` +
    `Met vriendelijke groet,\n${company}`
  const raw = quote.customer.phone.replace(/[^\d+]/g, '')
  let phone = raw.replace(/^\+/, '')
  if (phone.startsWith('0')) phone = '31' + phone.slice(1)
  const base = phone ? `https://wa.me/${phone}` : 'https://wa.me/'
  return `${base}?text=${encodeURIComponent(msg)}`
}

export default function App() {
  const [quote, setQuote] = useState<Quote>(() => createSampleQuote())
  const [history, setHistory] = useState<QuoteHistoryEntry[]>(() => loadHistory())
  const [historyOpen, setHistoryOpen] = useState(false)
  const [mobileTab, setMobileTab] = useState<'edit' | 'preview'>('edit')
  const [busy, setBusy] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => saveHistory(history), [history])

  useEffect(() => {
    if (!toast) return
    const id = setTimeout(() => setToast(null), 2600)
    return () => clearTimeout(id)
  }, [toast])

  const totals = useMemo(() => computeTotals(quote), [quote])

  const patch = (p: Partial<Quote>) => setQuote((q) => ({ ...q, ...p }))
  const patchCompany = (p: Partial<Company>) =>
    setQuote((q) => ({ ...q, company: { ...q.company, ...p } }))
  const patchCustomer = (p: Partial<Customer>) =>
    setQuote((q) => ({ ...q, customer: { ...q.customer, ...p } }))
  const setItems = (items: LineItem[]) =>
    setQuote((q) => ({ ...q, items }))

  const loadSample = () => {
    setQuote(createSampleQuote())
    setToast('Voorbeeldofferte geladen')
  }
  const newQuote = () => {
    setQuote(createEmptyQuote())
    setToast('Nieuwe offerte gestart')
  }

  const handleDownload = async () => {
    setBusy(true)
    try {
      await downloadPdf(quote)
      setToast('PDF gedownload')
    } catch {
      setToast('Er ging iets mis bij het maken van de PDF')
    } finally {
      setBusy(false)
    }
  }

  const handleWhatsapp = () => {
    window.open(buildWhatsappUrl(quote), '_blank', 'noopener,noreferrer')
  }

  const saveToHistory = () => {
    setHistory((prev) => {
      const existingIdx = prev.findIndex((e) => e.snapshot.id === quote.id)
      const entry: QuoteHistoryEntry = {
        id: quote.id,
        number: quote.number,
        date: quote.date,
        customerName: quote.customer.name,
        total: totals.total,
        savedAt: Date.now(),
        snapshot: quote,
      }
      if (existingIdx >= 0) {
        const next = [...prev]
        next[existingIdx] = entry
        return next
      }
      // New quote: consume the sequence counter and pre-arm the next number.
      bumpSequence()
      return [entry, ...prev]
    })
    setToast('Offerte bewaard in historie')
  }

  const loadFromHistory = (entry: QuoteHistoryEntry) => {
    setQuote(entry.snapshot)
    setHistoryOpen(false)
    setMobileTab('edit')
    setToast(`${entry.number} geopend`)
  }

  const deleteFromHistory = (id: string) =>
    setHistory((prev) => prev.filter((e) => e.id !== id))

  // After saving a new quote, the visible number should advance for the *next*
  // brand-new quote; existing edits keep their number. Re-derive on demand.
  const nextNumberHint = formatQuoteNumber(peekSequence())

  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1600px] items-center gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-accent shadow-sm">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 11 12 5l8 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6 10v8h12v-8"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="leading-tight">
              <h1 className="font-display text-[17px] font-extrabold text-ink">
                OfferteVlot
              </h1>
              <p className="hidden text-[11px] text-ink/45 sm:block">
                Professionele offertes in minuten
              </p>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={loadSample}
              className="btn-accent hidden sm:inline-flex"
            >
              <Sparkles width={16} height={16} /> Voorbeeld laden
            </button>
            <button
              onClick={() => setHistoryOpen(true)}
              className="btn-ghost relative"
              title="Historie"
            >
              <HistoryIcon width={16} height={16} />
              <span className="hidden md:inline">Historie</span>
              {history.length > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-ink-900">
                  {history.length}
                </span>
              )}
            </button>
            <button
              onClick={handleDownload}
              disabled={busy}
              className="btn-primary"
            >
              <Download width={16} height={16} />
              <span className="hidden sm:inline">
                {busy ? 'Bezig…' : 'Download PDF'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile tab switch */}
      <div className="sticky top-[57px] z-20 border-b border-slate-200 bg-paper/90 px-4 py-2 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-md rounded-lg border border-slate-200 bg-white p-0.5">
          {(
            [
              ['edit', 'Bewerken', Pencil],
              ['preview', 'Voorbeeld', Eye],
            ] as const
          ).map(([key, label, Icon]) => (
            <button
              key={key}
              onClick={() => setMobileTab(key)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-2 text-sm font-semibold transition ${
                mobileTab === key
                  ? 'bg-ink text-white'
                  : 'text-ink/55'
              }`}
            >
              <Icon width={15} height={15} /> {label}
            </button>
          ))}
        </div>
      </div>

      <main className="mx-auto max-w-[1600px] px-4 py-5 sm:px-6 sm:py-7">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,620px)] xl:grid-cols-[minmax(0,1fr)_minmax(0,680px)]">
          {/* Editor column */}
          <div
            className={`space-y-4 ${
              mobileTab === 'preview' ? 'hidden lg:block' : ''
            }`}
          >
            <div className="flex flex-wrap items-center gap-2 sm:hidden">
              <button onClick={loadSample} className="btn-accent flex-1">
                <Sparkles width={16} height={16} /> Voorbeeld laden
              </button>
              <button onClick={newQuote} className="btn-ghost">
                Nieuw
              </button>
            </div>

            <Section
              step={1}
              title="Bedrijfsgegevens"
              subtitle="Logo en gegevens voor de header en footer"
            >
              <CompanyForm company={quote.company} onChange={patchCompany} />
            </Section>

            <Section step={2} title="Klantgegevens" subtitle="Aan wie richt u de offerte?">
              <CustomerForm
                customer={quote.customer}
                onChange={patchCustomer}
              />
            </Section>

            <Section
              step={3}
              title="Offerteregels"
              subtitle="Werk, materiaal en arbeid met automatische totalen"
            >
              <LineItems quote={quote} onItems={setItems} onPatch={patch} />
            </Section>

            <Section
              step={4}
              title="Offertegegevens & voorwaarden"
              subtitle="Nummer, datums, inleiding en voorwaarden"
              defaultOpen={false}
            >
              <MetaForm quote={quote} onPatch={patch} />
            </Section>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button onClick={saveToHistory} className="btn-ghost">
                <Check width={16} height={16} /> Bewaar in historie
              </button>
              <button onClick={handleWhatsapp} className="btn-whatsapp">
                <Whatsapp width={16} height={16} /> Verstuur via WhatsApp
              </button>
              <button
                onClick={newQuote}
                className="btn-ghost ml-auto hidden sm:inline-flex"
              >
                Nieuwe offerte
              </button>
            </div>
            <p className="px-1 pb-2 text-[11px] text-ink/40">
              Volgend offertenummer: <span className="tabular">{nextNumberHint}</span>
            </p>
          </div>

          {/* Preview column */}
          <div
            className={`${mobileTab === 'edit' ? 'hidden lg:block' : ''}`}
          >
            <div className="lg:sticky lg:top-[88px]">
              <div className="mb-3 flex items-center justify-between px-1">
                <div className="flex items-center gap-2 text-sm font-semibold text-ink/60">
                  <Eye width={16} height={16} /> Live voorbeeld
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-ink/40">Totaal</span>
                  <span className="tabular font-display text-base font-bold text-ink">
                    {formatEuro(totals.total)}
                  </span>
                </div>
              </div>
              <div className="rounded-2xl bg-gradient-to-b from-slate-100 to-slate-200/60 p-3 sm:p-5">
                <PreviewPane quote={quote} />
              </div>
              <div className="mt-3 hidden items-center justify-center gap-2 lg:flex">
                <button
                  onClick={handleDownload}
                  disabled={busy}
                  className="btn-primary"
                >
                  <Download width={16} height={16} />
                  {busy ? 'Bezig…' : 'Download PDF'}
                </button>
                <button onClick={handleWhatsapp} className="btn-whatsapp">
                  <Whatsapp width={16} height={16} /> WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <HistoryDrawer
        open={historyOpen}
        entries={history}
        onClose={() => setHistoryOpen(false)}
        onLoad={loadFromHistory}
        onDelete={deleteFromHistory}
      />

      {/* Toast */}
      <div
        className={`pointer-events-none fixed bottom-5 left-1/2 z-50 -translate-x-1/2 transition-all duration-300 ${
          toast ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
        }`}
      >
        {toast && (
          <div className="flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-white shadow-float">
            <Check width={16} height={16} className="text-accent" />
            {toast}
          </div>
        )}
      </div>
    </div>
  )
}
