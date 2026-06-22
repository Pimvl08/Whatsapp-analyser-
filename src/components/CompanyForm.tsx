import type { Company } from '../types'
import { TextField, TextArea } from './fields'
import LogoDropzone from './LogoDropzone'

interface Props {
  company: Company
  onChange: (patch: Partial<Company>) => void
}

export default function CompanyForm({ company, onChange }: Props) {
  return (
    <div className="space-y-4">
      <LogoDropzone
        value={company.logo}
        onChange={(logo) => onChange({ logo })}
      />
      <TextField
        label="Bedrijfsnaam"
        value={company.name}
        onChange={(name) => onChange({ name })}
        placeholder="Voorbeeld Bedrijf B.V."
      />
      <TextArea
        label="Adres"
        value={company.address}
        onChange={(address) => onChange({ address })}
        placeholder={'Voorbeeldstraat 12\n1234 AB Voorbeeldstad'}
        rows={2}
      />
      <div className="grid grid-cols-2 gap-3">
        <TextField
          label="KvK-nummer"
          value={company.kvk}
          onChange={(kvk) => onChange({ kvk })}
          placeholder="12345678"
        />
        <TextField
          label="BTW-nummer"
          value={company.vat}
          onChange={(vat) => onChange({ vat })}
          placeholder="NL123456789B01"
        />
        <TextField
          label="Telefoon"
          value={company.phone}
          onChange={(phone) => onChange({ phone })}
          placeholder="012 345 6789"
        />
        <TextField
          label="E-mail"
          type="email"
          value={company.email}
          onChange={(email) => onChange({ email })}
          placeholder="info@bedrijf.nl"
        />
      </div>
      <TextField
        label="IBAN"
        value={company.iban}
        onChange={(iban) => onChange({ iban })}
        placeholder="NL12 BANK 0123 4567 89"
      />
    </div>
  )
}
