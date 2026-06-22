import type { Quote } from '../types'
import { computeTotals, lineTotal } from '../lib/calc'
import { formatEuro, formatNumber, formatDateNL } from '../lib/format'

/**
 * A pixel-accurate A4 rendering of the quote that mirrors the generated PDF.
 * Designed at the natural A4 size (794 x 1123px @96dpi); the parent scales it.
 */
export default function PreviewDocument({ quote }: { quote: Quote }) {
  const t = computeTotals(quote)
  const c = quote.company
  const cust = quote.customer
  const ink = '#16233A'
  const accent = '#C99A55'

  return (
    <div
      className="relative flex flex-col bg-white tabular"
      style={{
        width: 794,
        minHeight: 1123,
        padding: '64px 68px 92px',
        color: ink,
        fontFamily: 'Manrope, system-ui, sans-serif',
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          {c.logo ? (
            <div className="flex flex-col gap-2">
              <img
                src={c.logo}
                alt=""
                style={{ maxHeight: 62, maxWidth: 160, objectFit: 'contain' }}
              />
              {c.name && (
                <span className="text-[15px] font-bold" style={{ color: ink }}>
                  {c.name}
                </span>
              )}
            </div>
          ) : (
            <span className="font-display text-[26px] font-extrabold leading-tight">
              {c.name || 'Uw bedrijfsnaam'}
            </span>
          )}
        </div>
        <div className="text-right">
          <div
            className="font-display text-[34px] font-extrabold leading-none"
            style={{ color: ink, letterSpacing: '0.02em' }}
          >
            OFFERTE
          </div>
          <div
            className="ml-auto mt-2 h-[3px] w-[58px]"
            style={{ background: accent }}
          />
          <table className="ml-auto mt-4 text-[12.5px]">
            <tbody>
              {[
                ['Offertenummer', quote.number],
                ['Datum', formatDateNL(quote.date)],
                ['Geldig tot', formatDateNL(quote.validUntil)],
              ].map(([k, v]) => (
                <tr key={k}>
                  <td className="pr-5 text-right" style={{ color: '#8A95A3' }}>
                    {k}
                  </td>
                  <td className="text-right font-bold" style={{ color: ink }}>
                    {v || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="my-7 h-px w-full" style={{ background: '#DFE3E9' }} />

      {/* Address blocks */}
      <div className="grid grid-cols-2 gap-8">
        <Block label="OFFERTE VOOR" accent={accent}>
          <p className="text-[15px] font-bold" style={{ color: ink }}>
            {cust.name || '—'}
          </p>
          <AddressLines text={cust.address} />
          {!cust.sameAddress && cust.jobAddress.trim() && (
            <div className="mt-2">
              <p className="text-[11px] font-semibold" style={{ color: '#8A95A3' }}>
                Werkadres
              </p>
              <AddressLines text={cust.jobAddress} />
            </div>
          )}
          {cust.phone && <p className="text-[13px]" style={muted}>{cust.phone}</p>}
          {cust.email && <p className="text-[13px]" style={muted}>{cust.email}</p>}
        </Block>
        <Block label="VAN" accent={accent}>
          <p className="text-[15px] font-bold" style={{ color: ink }}>
            {c.name || '—'}
          </p>
          <AddressLines text={c.address} />
          {c.phone && <p className="text-[13px]" style={muted}>{c.phone}</p>}
          {c.email && <p className="text-[13px]" style={muted}>{c.email}</p>}
        </Block>
      </div>

      {/* Intro */}
      {quote.intro.trim() && (
        <p
          className="mt-7 whitespace-pre-line text-[13.5px] leading-relaxed"
          style={{ color: '#44505F' }}
        >
          {quote.intro.trim()}
        </p>
      )}

      {/* Items table */}
      <div className="mt-7">
        <div
          className="grid items-center px-3.5 py-2.5 text-[11px] font-bold tracking-wide text-white"
          style={{
            background: ink,
            gridTemplateColumns: '1fr 70px 64px 96px 104px',
          }}
        >
          <span>OMSCHRIJVING</span>
          <span className="text-right">AANTAL</span>
          <span className="pl-3">EENH.</span>
          <span className="text-right">STUKPRIJS</span>
          <span className="text-right">TOTAAL</span>
        </div>
        {quote.items.map((item, i) => (
          <div
            key={item.id}
            className="grid items-start px-3.5 py-2.5 text-[13px]"
            style={{
              gridTemplateColumns: '1fr 70px 64px 96px 104px',
              background: i % 2 === 1 ? '#F7F8FA' : '#fff',
              borderBottom: '1px solid #ECEFF3',
            }}
          >
            <span style={{ color: ink }}>{item.description || '—'}</span>
            <span className="text-right" style={muted}>
              {formatNumber(item.qty)}
            </span>
            <span className="pl-3" style={muted}>
              {item.unit}
            </span>
            <span className="text-right" style={muted}>
              {formatEuro(item.price)}
            </span>
            <span className="text-right font-bold" style={{ color: ink }}>
              {formatEuro(lineTotal(item))}
            </span>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="mt-6 flex justify-end">
        <div style={{ width: 300 }}>
          <SumRow label="Subtotaal" value={formatEuro(t.subtotal)} />
          {quote.discountEnabled && t.discount > 0 && (
            <SumRow
              label={
                quote.discountType === 'percent'
                  ? `Korting (${formatNumber(quote.discountValue)}%)`
                  : 'Korting'
              }
              value={'− ' + formatEuro(t.discount)}
            />
          )}
          <SumRow label={`BTW (${quote.vatRate}%)`} value={formatEuro(t.vat)} />
          <div
            className="mt-2 flex items-center justify-between rounded-[5px] px-4 py-3"
            style={{ background: ink, borderLeft: `5px solid ${accent}` }}
          >
            <span className="text-[14px] font-bold text-white">
              Totaal incl. btw
            </span>
            <span
              className="text-[18px] font-extrabold"
              style={{ color: accent }}
            >
              {formatEuro(t.total)}
            </span>
          </div>
        </div>
      </div>

      {/* Terms */}
      {quote.terms.trim() && (
        <div className="mt-8">
          <p
            className="text-[11px] font-bold tracking-wide"
            style={{ color: accent }}
          >
            VOORWAARDEN
          </p>
          <p
            className="mt-2 whitespace-pre-line text-[11.5px] leading-relaxed"
            style={{ color: '#44505F' }}
          >
            {quote.terms.trim()}
          </p>
        </div>
      )}

      {/* Signature */}
      <div
        className="mt-7 rounded-lg px-5 py-4"
        style={{ background: '#F4F0E8' }}
      >
        <p className="text-[13px] font-bold" style={{ color: ink }}>
          Akkoord met deze offerte?
        </p>
        <p className="mt-1 text-[12px]" style={{ color: '#44505F' }}>
          Onderteken hieronder en stuur de offerte retour. Wij plannen direct een
          datum met u in.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-8">
          <div>
            <div className="h-px w-full" style={{ background: '#B9C0CC' }} />
            <p className="mt-1.5 text-[11px]" style={{ color: '#8A95A3' }}>
              Handtekening opdrachtgever
            </p>
          </div>
          <div>
            <div className="h-px w-full" style={{ background: '#B9C0CC' }} />
            <p className="mt-1.5 text-[11px]" style={{ color: '#8A95A3' }}>
              Datum
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        className="absolute inset-x-[68px] bottom-[40px] border-t pt-3 text-[10.5px]"
        style={{ borderColor: '#DFE3E9', color: '#8A95A3' }}
      >
        <div className="flex items-center justify-between">
          <span>
            {[c.name, c.phone, c.email].filter(Boolean).join('   ·   ') || ' '}
          </span>
        </div>
        <div className="mt-1">
          {[
            c.kvk && `KvK ${c.kvk}`,
            c.vat && `BTW ${c.vat}`,
            c.iban && `IBAN ${c.iban}`,
          ]
            .filter(Boolean)
            .join('   ·   ')}
        </div>
      </div>
    </div>
  )
}

const muted = { color: '#44505F' }

function Block({
  label,
  accent,
  children,
}: {
  label: string
  accent: string
  children: React.ReactNode
}) {
  return (
    <div>
      <p
        className="mb-2 text-[11px] font-bold tracking-wide"
        style={{ color: accent }}
      >
        {label}
      </p>
      <div className="space-y-0.5">{children}</div>
    </div>
  )
}

function AddressLines({ text }: { text: string }) {
  return (
    <>
      {text
        .split('\n')
        .filter(Boolean)
        .map((l, i) => (
          <p key={i} className="text-[13px]" style={muted}>
            {l}
          </p>
        ))}
    </>
  )
}

function SumRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5 text-[13px]">
      <span style={{ color: '#44505F' }}>{label}</span>
      <span className="font-bold" style={{ color: '#16233A' }}>
        {value}
      </span>
    </div>
  )
}
