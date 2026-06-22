import { useState, type ReactNode } from 'react'
import { ChevronDown } from './icons'

interface Props {
  title: string
  step?: number
  subtitle?: string
  children: ReactNode
  defaultOpen?: boolean
  rightSlot?: ReactNode
}

export default function Section({
  title,
  step,
  subtitle,
  children,
  defaultOpen = true,
  rightSlot,
}: Props) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <section className="panel overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 px-4 py-3.5 text-left sm:px-5"
      >
        {step !== undefined && (
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink/5 text-[12px] font-bold text-ink">
            {step}
          </span>
        )}
        <span className="min-w-0 flex-1">
          <span className="block font-display text-[15px] font-700 font-semibold text-ink">
            {title}
          </span>
          {subtitle && (
            <span className="block text-xs text-ink/45">{subtitle}</span>
          )}
        </span>
        {rightSlot}
        <ChevronDown
          className={`shrink-0 text-ink/40 transition-transform duration-200 ${
            open ? '' : '-rotate-90'
          }`}
        />
      </button>
      <div
        className={`grid transition-all duration-200 ${
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-slate-100 px-4 py-4 sm:px-5 sm:py-5">
            {children}
          </div>
        </div>
      </div>
    </section>
  )
}
