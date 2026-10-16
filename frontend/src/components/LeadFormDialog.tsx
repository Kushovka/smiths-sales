import { useEffect, useRef, type ComponentProps, type KeyboardEvent } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { FaTimes } from 'react-icons/fa'
import { LeadForm } from './LeadForm'

type LeadFormDialogProps = {
  open: boolean
  onClose: () => void
  dialogTitle: string
  subtitle?: string
  formProps: ComponentProps<typeof LeadForm>
}

export const LeadFormDialog = ({ open, onClose, dialogTitle, subtitle, formProps }: LeadFormDialogProps) => {
  const prefersReducedMotion = useReducedMotion()
  const dialogRef = useRef<HTMLDivElement | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)
  const returnFocusRef = useRef<HTMLElement | null>(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  const handleDialogKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Tab') return
    const focusable = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])') ?? []).filter((element) => element.getClientRects().length > 0)
    if (!focusable.length) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  useEffect(() => {
    if (!open) return
    returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previousOverflow = document.body.style.overflow
    const handleEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') onCloseRef.current()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleEscape)
    closeButtonRef.current?.focus()
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleEscape)
      returnFocusRef.current?.focus()
    }
  }, [open])

  return <AnimatePresence>
    {open ? <motion.div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/65 p-3 backdrop-blur-[3px] sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: prefersReducedMotion ? 0.12 : 0.22 }} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <motion.div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="lead-form-dialog-title" className="relative max-h-[min(92dvh,900px)] w-full max-w-[680px] overflow-y-auto bg-[var(--color-background)] p-5 shadow-2xl sm:p-7" initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 18, scale: prefersReducedMotion ? 1 : 0.985 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: prefersReducedMotion ? 0 : 10, scale: prefersReducedMotion ? 1 : 0.99 }} transition={{ duration: prefersReducedMotion ? 0.12 : 0.3, ease: [0.16, 1, 0.3, 1] }} onKeyDown={handleDialogKeyDown}>
        <div className="mb-4 flex items-start justify-between gap-4"><div><h2 id="lead-form-dialog-title" className="text-2xl font-bold leading-tight text-[var(--color-primary)] sm:text-3xl">{dialogTitle}</h2>{subtitle ? <p className="mt-1 text-sm text-[var(--color-muted)]">{subtitle}</p> : null}</div><button ref={closeButtonRef} type="button" aria-label="Close request form" onClick={onClose} className="grid h-12 w-12 shrink-0 place-items-center border border-[var(--color-border)] text-[var(--color-text)] transition hover:bg-[var(--color-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"><FaTimes aria-hidden="true" className="h-5 w-5" /></button></div>
        <LeadForm {...formProps} animateInView={false} />
      </motion.div>
    </motion.div> : null}
  </AnimatePresence>
}
