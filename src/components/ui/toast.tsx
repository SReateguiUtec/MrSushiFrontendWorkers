import { useEffect, useState, useCallback, createContext, useContext, useRef } from 'react'
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: string
  message: string
  type: ToastType
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue>({ toast: () => {} })

export function useToast() {
  return useContext(ToastContext)
}

// ─── Single Toast Item ────────────────────────────────────────────────────────

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const [visible, setVisible] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    // Trigger enter animation
    requestAnimationFrame(() => setVisible(true))

    timerRef.current = setTimeout(() => {
      setVisible(false)
      setTimeout(() => onRemove(toast.id), 350)
    }, 4500)

    return () => clearTimeout(timerRef.current)
  }, [toast.id, onRemove])

  const handleClose = () => {
    clearTimeout(timerRef.current)
    setVisible(false)
    setTimeout(() => onRemove(toast.id), 350)
  }

  const config = {
    success: {
      icon: <CheckCircle2 size={17} />,
      bar:  '#22c55e',
      bg:   'rgba(34,197,94,0.08)',
      border: 'rgba(34,197,94,0.25)',
      text: '#4ade80',
    },
    error: {
      icon: <AlertCircle size={17} />,
      bar:  '#f87171',
      bg:   'rgba(248,113,113,0.08)',
      border: 'rgba(248,113,113,0.25)',
      text: '#f87171',
    },
    info: {
      icon: <Info size={17} />,
      bar:  '#60a5fa',
      bg:   'rgba(96,165,250,0.08)',
      border: 'rgba(96,165,250,0.25)',
      text: '#60a5fa',
    },
  }[toast.type]

  return (
    <div
      style={{
        transform: visible ? 'translateX(0)' : 'translateX(110%)',
        opacity: visible ? 1 : 0,
        transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1), opacity 0.35s ease',
        background: 'rgba(20,20,30,0.92)',
        backdropFilter: 'blur(16px)',
        border: `1px solid ${config.border}`,
        boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04) inset`,
        borderRadius: '14px',
        overflow: 'hidden',
        minWidth: '280px',
        maxWidth: '380px',
        pointerEvents: 'all',
      }}
    >
      {/* Progress bar */}
      <div style={{ height: '3px', background: `${config.bar}22` }}>
        <div
          style={{
            height: '100%',
            background: config.bar,
            boxShadow: `0 0 8px ${config.bar}`,
            animation: 'toast-shrink 4.5s linear forwards',
          }}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '12px 14px' }}>
        {/* Icon */}
        <div style={{ color: config.text, flexShrink: 0, marginTop: '1px' }}>
          {config.icon}
        </div>

        {/* Message */}
        <p style={{
          flex: 1,
          fontSize: '13px',
          fontWeight: 500,
          lineHeight: '1.5',
          color: '#e2e8f0',
          margin: 0,
          wordBreak: 'break-word',
        }}>
          {toast.message}
        </p>

        {/* Close button */}
        <button
          onClick={handleClose}
          style={{
            flexShrink: 0,
            display: 'grid',
            placeItems: 'center',
            width: '22px',
            height: '22px',
            borderRadius: '6px',
            border: 'none',
            background: 'rgba(255,255,255,0.06)',
            color: '#94a3b8',
            cursor: 'pointer',
            marginTop: '-2px',
          }}
        >
          <X size={12} />
        </button>
      </div>
    </div>
  )
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const remove = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const toast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).slice(2)
    setToasts(prev => [...prev, { id, message, type }])
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      {/* Portal-style container */}
      <div
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          pointerEvents: 'none',
        }}
      >
        <style>{`
          @keyframes toast-shrink {
            from { width: 100%; }
            to   { width: 0%; }
          }
        `}</style>
        {toasts.map(t => (
          <ToastItem key={t.id} toast={t} onRemove={remove} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}
