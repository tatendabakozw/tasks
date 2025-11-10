import React, { useEffect } from 'react'
import { AlertTriangle, X } from 'lucide-react'
import PrimaryButton from '@/components/buttons/primary-button'

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
  isLoading?: boolean
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false,
}: ConfirmModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, isLoading, onClose])

  if (!isOpen) return null

  const handleConfirm = () => {
    onConfirm()
  }

  const variantStyles = {
    danger: {
      icon: 'text-red-500 dark:text-red-400',
      iconBg: 'bg-red-100 dark:bg-red-900/20',
      button: 'bg-red-500 hover:bg-red-600 text-white',
    },
    warning: {
      icon: 'text-amber-500 dark:text-amber-400',
      iconBg: 'bg-amber-100 dark:bg-amber-900/20',
      button: 'bg-amber-500 hover:bg-amber-600 text-white',
    },
    info: {
      icon: 'text-blue-500 dark:text-blue-400',
      iconBg: 'bg-blue-100 dark:bg-blue-900/20',
      button: 'bg-blue-500 hover:bg-blue-600 text-white',
    },
  }

  const styles = variantStyles[variant]

  return (
    <>
      {/* Backdrop */}
      <div
        className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity'
        onClick={!isLoading ? onClose : undefined}
      />

      {/* Modal */}
      <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
        <div
          className='w-full max-w-md bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-xl transform transition-all'
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className='flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800'>
            <div className='flex items-center gap-3'>
              <div className={`p-2 rounded-lg ${styles.iconBg}`}>
                <AlertTriangle className={`h-5 w-5 ${styles.icon}`} />
              </div>
              <h2 className='text-xl font-semibold text-gray-900 dark:text-white font-heading'>
                {title}
              </h2>
            </div>
            {!isLoading && (
              <button
                onClick={onClose}
                className='p-1.5 text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-zinc-800'
                aria-label='Close modal'
              >
                <X className='h-5 w-5' />
              </button>
            )}
          </div>

          {/* Content */}
          <div className='p-6'>
            <p className='text-base text-gray-700 dark:text-gray-300 font-paragraph leading-relaxed'>
              {message}
            </p>
          </div>

          {/* Actions */}
          <div className='flex items-center justify-end gap-3 p-6 border-t border-zinc-200 dark:border-zinc-800'>
            <button
              type='button'
              onClick={onClose}
              disabled={isLoading}
              className='px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg font-buttons text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {cancelText}
            </button>
            <button
              type='button'
              onClick={handleConfirm}
              disabled={isLoading}
              className={`px-4 py-2.5 rounded-lg font-buttons text-sm font-medium transition-colors shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${styles.button}`}
            >
              {isLoading ? 'Processing...' : confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

