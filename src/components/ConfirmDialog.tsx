import { useEffect, useRef } from 'react'

interface ConfirmDialogProps {
  name: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({
  name,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null)
  const confirmRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    cancelRef.current?.focus()
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onCancel])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'Tab') return
    const focusable = [cancelRef.current, confirmRef.current].filter(
      Boolean,
    ) as HTMLButtonElement[]
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.55)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel()
      }}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      aria-describedby="confirm-desc"
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden
          border border-transparent dark:border-white/10"
        style={{ animation: 'dialogPop 0.18s cubic-bezier(0.34,1.56,0.64,1)' }}
      >
        <div className="h-1.5 w-full bg-gradient-to-r from-red-400 to-rose-500" />

        <div className="p-6">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-red-500 dark:text-red-400 text-base">
                ✕
              </span>
            </div>
            <div>
              <h2
                id="confirm-title"
                className="font-fredoka text-base font-bold text-gray-800 dark:text-gray-100 leading-snug"
              >
                Remove &ldquo;{name}&rdquo;?
              </h2>
            </div>
          </div>

          <p
            id="confirm-desc"
            className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-6 pl-12"
          >
            Are you sure you want to remove{' '}
            <span className="font-semibold text-gray-800 dark:text-gray-100">
              {name}
            </span>
            ? This will delete all their bond data.
          </p>

          <div className="flex gap-2 justify-end">
            <button
              ref={cancelRef}
              className="btn-secondary"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              ref={confirmRef}
              onClick={onConfirm}
              className="px-4 py-2 text-sm font-bold text-white rounded-xl transition-all cursor-pointer"
              style={{
                background: 'linear-gradient(135deg,#ef4444,#dc2626)',
                boxShadow: '0 2px 8px rgba(239,68,68,0.35)',
                border: 'none',
                fontFamily: 'Nunito',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.filter = 'brightness(1.08)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = ''
              }}
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
