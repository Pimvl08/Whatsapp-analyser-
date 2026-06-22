import { useEffect, useRef, useState } from 'react'
import type { Quote } from '../types'
import PreviewDocument from './PreviewDocument'

const A4_W = 794
const A4_H = 1123

export default function PreviewPane({ quote }: { quote: Quote }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const docRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.5)
  const [docHeight, setDocHeight] = useState(A4_H)

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    const ro = new ResizeObserver(() => {
      const w = wrap.clientWidth
      setScale(w / A4_W)
    })
    ro.observe(wrap)
    return () => ro.disconnect()
  }, [])

  // Track the real (possibly multi-page-tall) document height for the wrapper.
  useEffect(() => {
    if (docRef.current) {
      setDocHeight(Math.max(A4_H, docRef.current.offsetHeight))
    }
  })

  return (
    <div ref={wrapRef} className="w-full">
      <div
        style={{ height: docHeight * scale }}
        className="w-full overflow-hidden"
      >
        <div
          ref={docRef}
          style={{
            width: A4_W,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
          className="rounded-[2px] shadow-page ring-1 ring-black/5"
        >
          <PreviewDocument quote={quote} />
        </div>
      </div>
    </div>
  )
}
