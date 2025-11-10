import React, { useEffect } from 'react'
import { X } from 'lucide-react'

interface AddTaskModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (title: string) => void
}

export default function AddTaskModal({ isOpen, onClose, onAdd }: AddTaskModalProps) {
  const [taskTitle, setTaskTitle] = React.useState('')

  useEffect(() => {
    if (isOpen) {
      setTaskTitle('')
      // Focus input when modal opens
      const timer = setTimeout(() => {
        const input = document.getElementById('task-input')
        input?.focus()
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (taskTitle.trim()) {
      onAdd(taskTitle.trim())
      setTaskTitle('')
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity'
        onClick={onClose}
      />

      {/* Modal */}
      <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
        <div
          className='w-full max-w-md bg-white dark:bg-zim-cream-900 rounded-lg border border-zinc-200/50 dark:border-zinc-800/50 shadow-xl transform transition-all'
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className='flex items-center justify-between p-6 border-b border-zinc-200/50 dark:border-zinc-800/50'>
            <h2 className='text-xl font-semibold text-zim-cream-900 dark:text-zim-cream-50 font-heading'>
              Add New Task
            </h2>
            <button
              onClick={onClose}
              className='p-1.5 text-zim-cream-400 dark:text-zim-cream-500 hover:text-zim-cream-900 dark:hover:text-zim-cream-50 rounded-lg transition-colors hover:bg-zim-cream-100 dark:hover:bg-zim-cream-800'
              aria-label='Close modal'
            >
              <X className='h-5 w-5' />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className='p-6'>
            <div className='mb-6'>
              <label
                htmlFor='task-input'
                className='block text-sm font-medium text-zim-cream-700 dark:text-zim-cream-300 mb-2 font-paragraph'
              >
                Task Title
              </label>
              <input
                id='task-input'
                type='text'
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder='What needs to be done?'
                className='w-full px-4 py-3 bg-white dark:bg-zim-cream-800 border border-zinc-200/50 dark:border-zinc-800/50 rounded-lg text-zim-cream-900 dark:text-zim-cream-50 placeholder-zim-cream-400 dark:placeholder-zim-cream-500 focus:outline-none focus:ring-2 focus:ring-zim-green-500/50 focus:border-zim-green-500/50 font-paragraph transition-all'
                autoFocus
              />
            </div>

            {/* Actions */}
            <div className='flex items-center justify-end gap-3'>
              <button
                type='button'
                onClick={onClose}
                className='px-4 py-2.5 text-zim-cream-700 dark:text-zim-cream-300 hover:bg-zim-cream-100 dark:hover:bg-zim-cream-800 rounded-lg font-buttons text-sm font-medium transition-colors'
              >
                Cancel
              </button>
              <button
                type='submit'
                className='px-4 py-2.5 bg-zim-green-500 hover:bg-zim-green-600 text-white rounded-lg font-buttons text-sm font-medium transition-colors shadow-sm hover:shadow-md'
              >
                Add Task
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

