import type { Quote } from '../types'
import { Field, TextArea } from './fields'

interface Props {
  quote: Quote
  onPatch: (patch: Partial<Quote>) => void
}

export default function MetaForm({ quote, onPatch }: Props) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Field label="Offertenummer">
          <input
            className="field-input tabular"
            value={quote.number}
            onChange={(e) => onPatch({ number: e.target.value })}
          />
        </Field>
        <Field label="Offertedatum">
          <input
            type="date"
            className="field-input tabular"
            value={quote.date}
            onChange={(e) => onPatch({ date: e.target.value })}
          />
        </Field>
        <Field label="Geldig tot" className="col-span-2 sm:col-span-1">
          <input
            type="date"
            className="field-input tabular"
            value={quote.validUntil}
            onChange={(e) => onPatch({ validUntil: e.target.value })}
          />
        </Field>
      </div>
      <TextArea
        label="Inleiding / toelichting"
        value={quote.intro}
        onChange={(intro) => onPatch({ intro })}
        placeholder="Korte, persoonlijke introductie bij de klus…"
        rows={4}
      />
      <TextArea
        label="Voorwaarden / betalingsvoorwaarden"
        value={quote.terms}
        onChange={(terms) => onPatch({ terms })}
        rows={6}
      />
    </div>
  )
}
