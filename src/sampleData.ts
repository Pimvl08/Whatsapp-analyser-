import type { Quote, Company, Customer } from './types'
import { todayISO, addDaysISO } from './lib/format'
import { formatQuoteNumber, peekSequence } from './lib/storage'

export const DEFAULT_TERMS = `Deze offerte is 30 dagen geldig vanaf de offertedatum. Genoemde prijzen zijn exclusief btw, tenzij anders vermeld. Werkzaamheden worden uitgevoerd conform de geldende wet- en regelgeving en in goed overleg met de opdrachtgever.

Betaling: 30% bij aanvang van de werkzaamheden, het resterende bedrag binnen 14 dagen na oplevering. Meerwerk wordt uitsluitend uitgevoerd na schriftelijke akkoord en apart in rekening gebracht.

Op al onze werkzaamheden zijn onze algemene voorwaarden van toepassing.`

export const EMPTY_COMPANY: Company = {
  name: '',
  logo: null,
  address: '',
  kvk: '',
  vat: '',
  phone: '',
  email: '',
  iban: '',
}

export const EMPTY_CUSTOMER: Customer = {
  name: '',
  address: '',
  jobAddress: '',
  sameAddress: true,
  phone: '',
  email: '',
}

export function createEmptyQuote(): Quote {
  const date = todayISO()
  return {
    id: crypto.randomUUID(),
    number: formatQuoteNumber(peekSequence()),
    date,
    validUntil: addDaysISO(date, 30),
    intro: '',
    terms: DEFAULT_TERMS,
    vatRate: 21,
    discountEnabled: false,
    discountType: 'percent',
    discountValue: 0,
    items: [
      { id: crypto.randomUUID(), description: '', qty: 1, unit: 'stuks', price: 0 },
    ],
    company: { ...EMPTY_COMPANY },
    customer: { ...EMPTY_CUSTOMER },
  }
}

// A tasteful inline SVG logo used as a placeholder for the demo data.
const DEMO_LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240">
  <rect width="240" height="240" rx="44" fill="#16233A"/>
  <path d="M48 132 L120 72 L192 132" fill="none" stroke="#C99A55" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M70 124 V178 H170 V124" fill="none" stroke="#FFFFFF" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="108" y="146" width="24" height="32" rx="3" fill="#C99A55"/>
</svg>`

export const DEMO_LOGO_DATAURL =
  'data:image/svg+xml;base64,' +
  (typeof btoa !== 'undefined'
    ? btoa(unescape(encodeURIComponent(DEMO_LOGO_SVG)))
    : '')

export function createSampleQuote(): Quote {
  const date = todayISO()
  return {
    id: crypto.randomUUID(),
    number: formatQuoteNumber(peekSequence()),
    date,
    validUntil: addDaysISO(date, 30),
    intro:
      'Hartelijk dank voor uw aanvraag. Naar aanleiding van onze inspectie ter plaatse doen wij u graag een vrijblijvende offerte toekomen voor de hieronder omschreven werkzaamheden. (Voorbeeldtekst — vervang dit door uw eigen introductie.)',
    terms: DEFAULT_TERMS,
    vatRate: 21,
    discountEnabled: true,
    discountType: 'percent',
    discountValue: 5,
    items: [
      {
        id: crypto.randomUUID(),
        description:
          'Verwijderen bestaande dakbedekking en afvoeren bouw- en sloopafval',
        qty: 78,
        unit: 'm²',
        price: 18.5,
      },
      {
        id: crypto.randomUUID(),
        description:
          'Leveren en aanbrengen keramische dakpannen (Tuile du Nord, antraciet)',
        qty: 78,
        unit: 'm²',
        price: 64.0,
      },
      {
        id: crypto.randomUUID(),
        description:
          'Vervangen tengels en panlatten incl. waterkerende folie (Pro-clima)',
        qty: 78,
        unit: 'm²',
        price: 22.5,
      },
      {
        id: crypto.randomUUID(),
        description: 'Herstellen dakvoet, nieuwe zinken mastgoot en hemelwaterafvoer',
        qty: 12,
        unit: 'm¹',
        price: 47.5,
      },
      {
        id: crypto.randomUUID(),
        description: 'Arbeidsloon montageploeg incl. steiger en valbeveiliging',
        qty: 40,
        unit: 'uur',
        price: 52.5,
      },
    ],
    company: {
      name: 'Voorbeeld Bedrijf B.V.',
      logo: DEMO_LOGO_DATAURL,
      address: 'Voorbeeldstraat 12\n1234 AB Voorbeeldstad',
      kvk: '12345678',
      vat: 'NL123456789B01',
      phone: '012 345 6789',
      email: 'info@voorbeeldbedrijf.nl',
      iban: 'NL12 BANK 0123 4567 89',
    },
    customer: {
      name: 'Naam van de klant',
      address: 'Voorbeeldstraat 1\n1234 AB Voorbeeldstad',
      jobAddress: '',
      sameAddress: true,
      phone: '06 1234 5678',
      email: 'klant@voorbeeld.nl',
    },
  }
}
