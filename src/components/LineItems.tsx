import type { LineItem, Quote, Unit, VatRate, DiscountType } from '../types'
import { lineTotal, computeTotals } from '../lib/calc'
import { formatEuro } from '../lib/format'
import { Plus, Trash, ChevronUp, ChevronDown } from './icons'

const UNITS: Unit[] = ['m²', 'm¹', 'stuks', 'uur', 'dag', 'post', 'set']

interface Props {
  quote: Quote
  onItems: (items: LineItem[]) => void
  onPatch: (patch: Partial<Quote>) => void
}

export default function LineItems({ quote, onItems, onPatch }: Props) {
  const items = quote.items
  const totals = computeTotals(quote)

  const update = (id: string, patch: Partial<LineItem>) =>
    onItems(items.map((it) => (it.id === id ? { ...it, ...patch } : it)))

  const add = () =>
    onItems([
      ...items,
      {
        id: crypto.randomUUID(),
        description: '',
        qty: 1,
        unit: 'm²',
        price: 0,
      },
    ])

  const remove = (id: string) => onItems(items.filter((it) => it.id !== id))

  const move = (index: number, dir: -1 | 1) => {
    const next = [...items]
    const target = index + dir
    if (target < 0 || target >= next.length) return
    ;[next[index], next[target]] = [next[target], next[index]]
    onItems(next)
  }

  return (
    <div className="space-y-4">
      {/* Column header (desktop) */}
      <div className="hidden grid-cols-[1fr_70px_84px_96px_96px_32px] gap-2 px-1 sm:grid">
        <span className="field-label mb-0">Omschrijving</span>
        <span className="field-label mb-0 text-right">Aantal</span>
        <span className="field-label mb-0">Eenheid</span>
        <span className="field-label mb-0 text-right">Stukprijs</span>
        <span className="field-label mb-0 text-right">Totaal</span>
        <span />
      </div>

      <div className="space-y-2.5">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="rounded-xl border border-slate-200 bg-white p-2.5 sm:border-transparent sm:bg-transparent sm:p-0"
          >
            <div className="grid gap-2 sm:grid-cols-[1fr_70px_84px_96px_96px_32px] sm:items-center">
              <input
                className="field-input-sm sm:rounded-md"
                placeholder="Bijv. Leveren en aanbrengen dakpannen"
                value={item.description}
                onChange={(e) => update(item.id, { description: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-2 sm:contents">
                <input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step="any"
                  className="field-input-sm text-right tabular"
                  value={item.qty === 0 ? '' : item.qty}
                  placeholder="0"
                  onChange={(e) =>
                    update(item.id, { qty: parseFloat(e.target.value) || 0 })
                  }
                />
                <select
                  className="field-input-sm bg-white"
                  value={item.unit}
                  onChange={(e) =>
                    update(item.id, { unit: e.target.value as Unit })
                  }
                >
                  {UNITS.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 items-center gap-2 sm:contents">
                <div className="relative">
                  <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-ink/40">
                    €
                  </span>
                  <input
                    type="number"
                    inputMode="decimal"
                    min={0}
                    step="any"
                    className="field-input-sm pl-6 text-right tabular"
                    value={item.price === 0 ? '' : item.price}
                    placeholder="0,00"
                    onChange={(e) =>
                      update(item.id, { price: parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>
                <span className="text-right text-sm font-semibold tabular text-ink">
                  {formatEuro(lineTotal(item))}
                </span>
              </div>
              <div className="flex items-center justify-end gap-1">
                <div className="flex flex-col">
                  <button
                    type="button"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    className="text-ink/30 hover:text-ink disabled:opacity-20"
                    aria-label="Omhoog"
                  >
                    <ChevronUp width={15} height={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, 1)}
                    disabled={index === items.length - 1}
                    className="text-ink/30 hover:text-ink disabled:opacity-20"
                    aria-label="Omlaag"
                  >
                    <ChevronDown width={15} height={15} />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => remove(item.id)}
                  className="flex h-7 w-7 items-center justify-center rounded-md text-ink/30 hover:bg-red-50 hover:text-red-500"
                  aria-label="Regel verwijderen"
                >
                  <Trash width={15} height={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={add}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 py-2.5 text-sm font-semibold text-ink/60 transition hover:border-accent hover:text-accent-dark"
      >
        <Plus width={16} height={16} /> Regel toevoegen
      </button>

      {/* VAT + discount + totals */}
      <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <div>
            <span className="field-label">BTW-tarief</span>
            <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5">
              {([21, 9, 0] as VatRate[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => onPatch({ vatRate: r })}
                  className={`rounded-md px-3 py-1.5 text-sm font-semibold transition ${
                    quote.vatRate === r
                      ? 'bg-ink text-white'
                      : 'text-ink/55 hover:text-ink'
                  }`}
                >
                  {r}%
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="field-label">Korting</span>
            <label className="flex h-[38px] items-center gap-2">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-accent focus:ring-accent/30"
                checked={quote.discountEnabled}
                onChange={(e) => onPatch({ discountEnabled: e.target.checked })}
              />
              <span className="text-sm text-ink/70">Korting toepassen</span>
            </label>
          </div>

          {quote.discountEnabled && (
            <div className="flex items-end gap-2">
              <div>
                <span className="field-label">Type</span>
                <select
                  className="field-input-sm bg-white"
                  value={quote.discountType}
                  onChange={(e) =>
                    onPatch({ discountType: e.target.value as DiscountType })
                  }
                >
                  <option value="percent">Percentage (%)</option>
                  <option value="amount">Vast bedrag (€)</option>
                </select>
              </div>
              <div className="w-24">
                <span className="field-label">Waarde</span>
                <input
                  type="number"
                  min={0}
                  step="any"
                  className="field-input-sm text-right tabular"
                  value={quote.discountValue === 0 ? '' : quote.discountValue}
                  placeholder="0"
                  onChange={(e) =>
                    onPatch({ discountValue: parseFloat(e.target.value) || 0 })
                  }
                />
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 space-y-1.5 border-t border-slate-200 pt-3 text-sm">
          <Row label="Subtotaal" value={formatEuro(totals.subtotal)} />
          {quote.discountEnabled && totals.discount > 0 && (
            <>
              <Row
                label="Korting"
                value={'- ' + formatEuro(totals.discount)}
                accent
              />
              <Row
                label="Subtotaal na korting"
                value={formatEuro(totals.taxableBase)}
              />
            </>
          )}
          <Row
            label={`BTW (${quote.vatRate}%)`}
            value={formatEuro(totals.vat)}
          />
          <div className="mt-1 flex items-center justify-between border-t border-slate-200 pt-2.5">
            <span className="font-display text-base font-bold text-ink">
              Totaal incl. btw
            </span>
            <span className="font-display text-lg font-bold tabular text-ink">
              {formatEuro(totals.total)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function Row({
  label,
  value,
  accent,
}: {
  label: string
  value: string
  accent?: boolean
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-ink/55">{label}</span>
      <span
        className={`tabular font-semibold ${
          accent ? 'text-accent-dark' : 'text-ink'
        }`}
      >
        {value}
      </span>
    </div>
  )
}
