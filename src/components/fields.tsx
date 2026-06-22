import type { ReactNode } from 'react'

interface FieldProps {
  label: string
  children: ReactNode
  className?: string
  hint?: string
}

export function Field({ label, children, className = '', hint }: FieldProps) {
  return (
    <label className={`block ${className}`}>
      <span className="field-label">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[11px] text-ink/40">{hint}</span>}
    </label>
  )
}

interface TextProps {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  className?: string
  hint?: string
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  className,
  hint,
}: TextProps) {
  return (
    <Field label={label} className={className} hint={hint}>
      <input
        type={type}
        className="field-input"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </Field>
  )
}

interface AreaProps {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  rows?: number
  className?: string
}

export function TextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
  className,
}: AreaProps) {
  return (
    <Field label={label} className={className}>
      <textarea
        className="field-input resize-y leading-relaxed"
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </Field>
  )
}
