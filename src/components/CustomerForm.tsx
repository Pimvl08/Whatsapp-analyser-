import type { Customer } from '../types'
import { TextField, TextArea } from './fields'

interface Props {
  customer: Customer
  onChange: (patch: Partial<Customer>) => void
}

export default function CustomerForm({ customer, onChange }: Props) {
  return (
    <div className="space-y-4">
      <TextField
        label="Naam klant"
        value={customer.name}
        onChange={(name) => onChange({ name })}
        placeholder="Naam van de klant"
      />
      <TextArea
        label="Factuuradres"
        value={customer.address}
        onChange={(address) => onChange({ address })}
        placeholder={'Voorbeeldstraat 1\n1234 AB Voorbeeldstad'}
        rows={2}
      />
      <label className="flex cursor-pointer items-center gap-2.5 select-none">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-slate-300 text-accent focus:ring-accent/30"
          checked={customer.sameAddress}
          onChange={(e) => onChange({ sameAddress: e.target.checked })}
        />
        <span className="text-sm text-ink/70">
          Klusadres is hetzelfde als factuuradres
        </span>
      </label>
      {!customer.sameAddress && (
        <TextArea
          label="Klusadres"
          value={customer.jobAddress}
          onChange={(jobAddress) => onChange({ jobAddress })}
          placeholder={'Werklocatie adres'}
          rows={2}
        />
      )}
      <div className="grid grid-cols-2 gap-3">
        <TextField
          label="Telefoon"
          value={customer.phone}
          onChange={(phone) => onChange({ phone })}
          placeholder="06 1234 5678"
        />
        <TextField
          label="E-mail"
          type="email"
          value={customer.email}
          onChange={(email) => onChange({ email })}
          placeholder="klant@email.nl"
        />
      </div>
    </div>
  )
}
