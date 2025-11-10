import { useEffect, useRef } from 'react'

/**
 * Hook for managing modal accessibility features:
 * - Focus trapping
 * - Escape key handling
 * - Focus return on close
 * - ARIA attributes
 */
export function useModal(isOpen: boolean, onClose: () => void, options?: { preventClose?: boolean }) {
  const modalRef = useRef<HTMLDivElement>(null)
  const previousActiveElementRef = useRef<HTMLElement | null>(null)

  // Save the previously focused element when modal opens
  useEffect(() => {
    if (isOpen) {
      previousActiveElementRef.current = document.activeElement as HTMLElement
    } else if (previousActiveElementRef.current) {
      // Return focus to the previously focused element when modal closes
      previousActiveElementRef.current.focus()
      previousActiveElementRef.current = null
    }
  }, [isOpen])

  // Handle Escape key
  useEffect(() => {
    if (!isOpen || options?.preventClose) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose, options?.preventClose])

  // Focus trapping
  useEffect(() => {
    if (!isOpen || !modalRef.current) return

    const modal = modalRef.current
    const focusableElements = modal.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    modal.addEventListener('keydown', handleTabKey)

    // Focus first element when modal opens
    if (firstElement) {
      // Small delay to ensure modal is fully rendered
      setTimeout(() => {
        firstElement.focus()
      }, 100)
    }

    return () => {
      modal.removeEventListener('keydown', handleTabKey)
    }
  }, [isOpen])

  return { modalRef }
}

