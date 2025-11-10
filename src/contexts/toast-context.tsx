import React, { createContext, useContext, useState, useCallback } from 'react'
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
}

interface ToastContextType {
  toasts: Toast[]
  showToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  success: (title: string, message?: string) => void
  error: (title: string, message?: string) => void
  warning: (title: string, message?: string) => void
  info: (title: string, message?: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback(
    (toast: Omit<Toast, 'id'>) => {
      const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
      const newToast: Toast = {
        ...toast,
        id,
        duration: toast.duration ?? 5000,
      }

      setToasts((prev) => [...prev, newToast])

      // Auto-remove after duration
      if (newToast.duration && newToast.duration > 0) {
        setTimeout(() => {
          removeToast(id)
        }, newToast.duration)
      }
    },
    [removeToast]
  )

  const success = useCallback(
    (title: string, message?: string) => {
      showToast({ type: 'success', title, message })
    },
    [showToast]
  )

  const error = useCallback(
    (title: string, message?: string) => {
      showToast({ type: 'error', title, message })
    },
    [showToast]
  )

  const warning = useCallback(
    (title: string, message?: string) => {
      showToast({ type: 'warning', title, message })
    },
    [showToast]
  )

  const info = useCallback(
    (title: string, message?: string) => {
      showToast({ type: 'info', title, message })
    },
    [showToast]
  )

  return (
    <ToastContext.Provider
      value={{
        toasts,
        showToast,
        removeToast,
        success,
        error,
        warning,
        info,
      }}
    >
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

// Toast Container Component
function ToastContainer({
  toasts,
  removeToast,
}: {
  toasts: Toast[]
  removeToast: (id: string) => void
}) {
  return (
    <div className='fixed top-20 right-4 z-50 flex flex-col gap-2 w-full max-w-sm pointer-events-none'>
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  )
}

// Individual Toast Component
function ToastItem({
  toast,
  onRemove,
}: {
  toast: Toast
  onRemove: (id: string) => void
}) {
  const getToastStyles = (type: ToastType) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-emerald-50 dark:bg-emerald-900/20',
          border: 'border-emerald-200 dark:border-emerald-800',
          icon: 'text-emerald-600 dark:text-emerald-400',
          iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
          title: 'text-emerald-900 dark:text-emerald-100',
        }
      case 'error':
        return {
          bg: 'bg-red-50 dark:bg-red-900/20',
          border: 'border-red-200 dark:border-red-800',
          icon: 'text-red-600 dark:text-red-400',
          iconBg: 'bg-red-100 dark:bg-red-900/30',
          title: 'text-red-900 dark:text-red-100',
        }
      case 'warning':
        return {
          bg: 'bg-amber-50 dark:bg-amber-900/20',
          border: 'border-amber-200 dark:border-amber-800',
          icon: 'text-amber-600 dark:text-amber-400',
          iconBg: 'bg-amber-100 dark:bg-amber-900/30',
          title: 'text-amber-900 dark:text-amber-100',
        }
      case 'info':
        return {
          bg: 'bg-blue-50 dark:bg-blue-900/20',
          border: 'border-blue-200 dark:border-blue-800',
          icon: 'text-blue-600 dark:text-blue-400',
          iconBg: 'bg-blue-100 dark:bg-blue-900/30',
          title: 'text-blue-900 dark:text-blue-100',
        }
    }
  }

  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className='h-5 w-5' />
      case 'error':
        return <XCircle className='h-5 w-5' />
      case 'warning':
        return <AlertCircle className='h-5 w-5' />
      case 'info':
        return <Info className='h-5 w-5' />
    }
  }

  const styles = getToastStyles(toast.type)

  return (
    <div
      className={`
        pointer-events-auto
        ${styles.bg}
        ${styles.border}
        border rounded-lg shadow-lg
        p-4
        flex items-start gap-3
        transform transition-all duration-300 ease-out
        animate-slide-in
      `}
      role='alert'
      aria-live='assertive'
    >
      {/* Icon */}
      <div className={`flex-shrink-0 p-1.5 rounded-lg ${styles.iconBg}`}>
        <div className={styles.icon}>{getIcon(toast.type)}</div>
      </div>

      {/* Content */}
      <div className='flex-1 min-w-0'>
        <h4 className={`text-sm font-semibold font-heading mb-0.5 ${styles.title}`}>
          {toast.title}
        </h4>
        {toast.message && (
          <p className='text-sm text-gray-600 dark:text-gray-400 font-paragraph'>
            {toast.message}
          </p>
        )}
      </div>

      {/* Close Button */}
      <button
        onClick={() => onRemove(toast.id)}
        className={`
          flex-shrink-0
          p-1
          ${styles.icon}
          hover:opacity-70
          rounded transition-opacity
        `}
        aria-label='Close toast'
      >
        <X className='h-4 w-4' />
      </button>
    </div>
  )
}

