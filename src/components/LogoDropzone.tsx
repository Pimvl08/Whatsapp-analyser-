import { useRef, useState } from 'react'
import { Upload, X, Image as ImageIcon } from './icons'

interface Props {
  value: string | null
  onChange: (dataUrl: string | null) => void
}

export default function LogoDropzone({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [drag, setDrag] = useState(false)
  const [error, setError] = useState('')

  const handleFile = (file: File | undefined) => {
    setError('')
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Kies een afbeelding (PNG, JPG of SVG).')
      return
    }
    if (file.size > 4 * 1024 * 1024) {
      setError('Bestand is te groot (max. 4 MB).')
      return
    }
    const reader = new FileReader()
    reader.onload = () => onChange(reader.result as string)
    reader.readAsDataURL(file)
  }

  return (
    <div>
      <span className="field-label">Logo</span>
      {value ? (
        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50/60 p-3">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white">
            <img
              src={value}
              alt="Logo"
              className="max-h-full max-w-full object-contain"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-ink">Logo toegevoegd</p>
            <p className="text-xs text-ink/45">
              Verschijnt linksboven in de offerte.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-ink hover:bg-slate-50"
            >
              Wijzig
            </button>
            <button
              type="button"
              onClick={() => onChange(null)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-ink/50 hover:text-red-500"
              aria-label="Logo verwijderen"
            >
              <X width={15} height={15} />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault()
            setDrag(true)
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDrag(false)
            handleFile(e.dataTransfer.files?.[0])
          }}
          className={`flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-7 text-center transition ${
            drag
              ? 'border-accent bg-accent/5'
              : 'border-slate-200 bg-slate-50/40 hover:border-slate-300 hover:bg-slate-50'
          }`}
        >
          <span
            className={`flex h-11 w-11 items-center justify-center rounded-full ${
              drag ? 'bg-accent/15 text-accent-dark' : 'bg-white text-ink/40'
            } border border-slate-200`}
          >
            {drag ? <Upload /> : <ImageIcon />}
          </span>
          <span className="text-sm font-semibold text-ink">
            Sleep je logo hierheen
          </span>
          <span className="text-xs text-ink/45">
            of klik om te bladeren — PNG, JPG of SVG
          </span>
        </button>
      )}
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0] ?? undefined)}
      />
    </div>
  )
}
