import type { QuoteHistoryEntry } from '../types'
import { formatEuro, formatDateNL } from '../lib/format'
import { X, Trash, HistoryIcon } from './icons'

interface Props {
  open: boolean
  entries: QuoteHistoryEntry[]
  onClose: () => void
  onLoad: (entry: QuoteHistoryEntry) => void
  onDelete: (id: string) => void
}

export default function HistoryDrawer({
  open,
  entries,
  onClose,
  onLoad,
  onDelete,
}: Props) {
  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm transition-opacity ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />
      <aside
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-paper shadow-float transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
          <div className="flex items-center gap-2.5">
            <HistoryIcon className="text-accent-dark" />
            <h2 className="font-display text-base font-bold text-ink">
              Offertehistorie
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-ink/50 hover:bg-slate-100"
            aria-label="Sluiten"
          >
            <X />
          </button>
        </header>

        <div className="scroll-slim flex-1 overflow-y-auto p-4">
          {entries.length === 0 ? (
            <div className="mt-16 px-6 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-ink/30">
                <HistoryIcon width={24} height={24} />
              </div>
              <p className="text-sm font-semibold text-ink">Nog geen offertes</p>
              <p className="mt-1 text-xs text-ink/45">
                Opgeslagen offertes verschijnen hier. Klik op “Bewaar in historie”
                om te beginnen.
              </p>
            </div>
          ) : (
            <ul className="space-y-2.5">
              {entries.map((e) => (
                <li
                  key={e.id}
                  className="group rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm transition hover:border-accent/50"
                >
                  <div className="flex items-start justify-between gap-2">
                    <button
                      onClick={() => onLoad(e)}
                      className="min-w-0 flex-1 text-left"
                    >
                      <div className="flex items-center gap-2">
                        <span className="tabular text-sm font-bold text-ink">
                          {e.number}
                        </span>
                        <span className="text-xs text-ink/40">
                          {formatDateNL(e.date)}
                        </span>
                      </div>
                      <p className="truncate text-sm text-ink/70">
                        {e.customerName || 'Onbekende klant'}
                      </p>
                      <p className="mt-1 tabular text-sm font-semibold text-accent-dark">
                        {formatEuro(e.total)}
                      </p>
                    </button>
                    <button
                      onClick={() => onDelete(e.id)}
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-ink/30 hover:bg-red-50 hover:text-red-500"
                      aria-label="Verwijderen"
                    >
                      <Trash width={15} height={15} />
                    </button>
                  </div>
                  <button
                    onClick={() => onLoad(e)}
                    className="mt-2 w-full rounded-lg bg-slate-50 py-1.5 text-xs font-semibold text-ink/60 transition group-hover:bg-ink group-hover:text-white"
                  >
                    Openen in editor
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </>
  )
}
