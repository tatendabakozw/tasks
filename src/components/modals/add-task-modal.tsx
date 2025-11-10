import React, { useEffect, useRef } from 'react'
import { X, AlertCircle } from 'lucide-react'
import PrimaryButton from '@/components/buttons/primary-button'
import { TaskStatus, TaskPriority } from '@/contexts/tasks-context'
import SelectMenu from '@/components/menus/select-menu'
import { useToast } from '@/contexts/toast-context'
import { useModal } from '@/hooks/use-modal'

interface AddTaskModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (task: {
    title: string
    description: string
    status: TaskStatus
    assignee: string
    dueDate: string
    priority: TaskPriority
  }) => Promise<void>
}

interface FormErrors {
  title?: string
  status?: string
  priority?: string
}

export default function AddTaskModal({ isOpen, onClose, onAdd }: AddTaskModalProps) {
  const { success, error: showError } = useToast()
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [taskTitle, setTaskTitle] = React.useState('')
  const [taskDescription, setTaskDescription] = React.useState('')
  const [taskStatus, setTaskStatus] = React.useState<TaskStatus>('Todo')
  const [taskAssignee, setTaskAssignee] = React.useState('')
  const [taskDueDate, setTaskDueDate] = React.useState('')
  const [taskPriority, setTaskPriority] = React.useState<TaskPriority>('Medium')
  const [errors, setErrors] = React.useState<FormErrors>({})
  const [touched, setTouched] = React.useState<Record<string, boolean>>({})
  const errorAnnouncementRef = useRef<HTMLDivElement>(null)
  const { modalRef } = useModal(isOpen, onClose, { preventClose: isSubmitting })

  useEffect(() => {
    if (isOpen) {
      setTaskTitle('')
      setTaskDescription('')
      setTaskStatus('Todo')
      setTaskAssignee('')
      setTaskDueDate('')
      setTaskPriority('Medium')
      setErrors({})
      setTouched({})
    }
  }, [isOpen])

  // Announce validation errors to screen readers
  useEffect(() => {
    if (errorAnnouncementRef.current && Object.keys(errors).length > 0) {
      const errorMessages = Object.values(errors).filter(Boolean).join('. ')
      errorAnnouncementRef.current.textContent = `Validation errors: ${errorMessages}`
    }
  }, [errors])

  const validateForm = (): { isValid: boolean; errors: FormErrors; firstError?: string } => {
    const newErrors: FormErrors = {}

    if (!taskTitle.trim()) {
      newErrors.title = 'Task title is required'
    }

    if (!taskStatus) {
      newErrors.status = 'Status is required'
    }

    if (!taskPriority) {
      newErrors.priority = 'Priority is required'
    }

    setErrors(newErrors)
    const firstError = Object.values(newErrors).find(Boolean)
    return {
      isValid: Object.keys(newErrors).length === 0,
      errors: newErrors,
      firstError,
    }
  }

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    // Validate only the touched field
    const newErrors: FormErrors = { ...errors }
    
    if (field === 'title' && !taskTitle.trim()) {
      newErrors.title = 'Task title is required'
    } else if (field === 'title') {
      delete newErrors.title
    }

    if (field === 'status' && !taskStatus) {
      newErrors.status = 'Status is required'
    } else if (field === 'status') {
      delete newErrors.status
    }

    if (field === 'priority' && !taskPriority) {
      newErrors.priority = 'Priority is required'
    } else if (field === 'priority') {
      delete newErrors.priority
    }

    setErrors(newErrors)
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Mark all fields as touched
    setTouched({ title: true, status: true, priority: true })
    
    const validation = validateForm()
    if (!validation.isValid) {
      // Show toast for validation errors
      if (validation.firstError) {
        showError('Validation Error', validation.firstError)
      }
      // Focus first error field
      const firstErrorField = Object.keys(validation.errors)[0]
      if (firstErrorField === 'title') {
        document.getElementById('task-input')?.focus()
      }
      return
    }

    setIsSubmitting(true)
    try {
      await onAdd({
        title: taskTitle.trim(),
        description: taskDescription.trim(),
        status: taskStatus,
        assignee: taskAssignee.trim(),
        dueDate: taskDueDate || new Date().toISOString().split('T')[0],
        priority: taskPriority,
      })
      success('Task created', `"${taskTitle.trim()}" has been added successfully`)
      setTaskTitle('')
      setTaskDescription('')
      setTaskStatus('Todo')
      setTaskAssignee('')
      setTaskDueDate('')
      setTaskPriority('Medium')
      setErrors({})
      setTouched({})
      onClose()
    } catch (error) {
      showError('Error', 'Failed to create task. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  const modalTitleId = 'add-task-modal-title'

  return (
    <>
      {/* ARIA live region for validation errors */}
      <div
        ref={errorAnnouncementRef}
        role='alert'
        aria-live='assertive'
        aria-atomic='true'
        className='sr-only'
      />

      {/* Backdrop */}
      <div
        className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity'
        onClick={!isSubmitting ? onClose : undefined}
        aria-hidden='true'
      />

      {/* Modal */}
      <div
        className='fixed inset-0 z-50 flex items-center justify-center p-4'
        role='dialog'
        aria-modal='true'
        aria-labelledby={modalTitleId}
      >
        <div
          ref={modalRef}
          className='w-full max-w-md bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-xl transform transition-all'
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className='flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800'>
            <h2 id={modalTitleId} className='text-xl font-semibold text-gray-900 dark:text-white font-heading'>
              Add New Task
            </h2>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className='p-1.5 text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed'
              aria-label='Close modal'
            >
              <X className='h-5 w-5' />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className='p-6' noValidate>
            <div className='space-y-4'>
              <div>
                <label
                  htmlFor='task-input'
                  className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-paragraph'
                >
                  Task Title *
                </label>
                <input
                  id='task-input'
                  type='text'
                  value={taskTitle}
                  onChange={(e) => {
                    setTaskTitle(e.target.value)
                    if (touched.title && errors.title) {
                      handleBlur('title')
                    }
                  }}
                  onBlur={() => handleBlur('title')}
                  placeholder='What needs to be done?'
                  aria-required='true'
                  aria-invalid={touched.title && !!errors.title}
                  aria-describedby={touched.title && errors.title ? 'task-input-error' : undefined}
                  className={`w-full px-4 py-3 bg-white dark:bg-zinc-800 border rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none font-paragraph transition-all ${
                    touched.title && errors.title
                      ? 'border-red-500 dark:border-red-500 focus:ring-2 focus:ring-red-500/50 focus:border-red-500'
                      : 'border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-zim-green-500/50 focus:border-zim-green-500/50'
                  }`}
                />
                {touched.title && errors.title && (
                  <div
                    id='task-input-error'
                    role='alert'
                    className='mt-1.5 flex items-center gap-1.5 text-sm text-red-600 dark:text-red-400 font-paragraph'
                  >
                    <AlertCircle className='h-4 w-4 flex-shrink-0' aria-hidden='true' />
                    <span>{errors.title}</span>
                  </div>
                )}
              </div>
              
              <div>
                <label
                  htmlFor='task-description'
                  className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-paragraph'
                >
                  Description
                </label>
                <textarea
                  id='task-description'
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  placeholder='Add more details about this task...'
                  rows={4}
                  className='w-full px-4 py-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-zim-green-500/50 focus:border-zim-green-500/50 font-paragraph transition-all resize-none'
                />
              </div>

              {/* Status */}
              <div>
                <label
                  htmlFor='task-status'
                  className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-paragraph'
                >
                  Status *
                </label>
                <div
                  onBlur={() => handleBlur('status')}
                  className={touched.status && errors.status ? 'rounded-lg ring-2 ring-red-500/50' : ''}
                >
                  <SelectMenu
                    value={taskStatus}
                    onChange={(value) => {
                      setTaskStatus(value as TaskStatus)
                      if (touched.status && errors.status) {
                        handleBlur('status')
                      }
                    }}
                    options={[
                      { value: 'Todo', label: 'Todo' },
                      { value: 'Doing', label: 'Doing' },
                      { value: 'Done', label: 'Done' },
                    ]}
                    placeholder='Select status...'
                  />
                </div>
                {touched.status && errors.status && (
                  <div
                    id='task-status-error'
                    role='alert'
                    className='mt-1.5 flex items-center gap-1.5 text-sm text-red-600 dark:text-red-400 font-paragraph'
                  >
                    <AlertCircle className='h-4 w-4 flex-shrink-0' aria-hidden='true' />
                    <span>{errors.status}</span>
                  </div>
                )}
              </div>

              {/* Assignee */}
              <div>
                <label
                  htmlFor='task-assignee'
                  className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-paragraph'
                >
                  Assignee
                </label>
                <input
                  id='task-assignee'
                  type='text'
                  value={taskAssignee}
                  onChange={(e) => setTaskAssignee(e.target.value)}
                  placeholder='Who is responsible for this task?'
                  className='w-full px-4 py-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-zim-green-500/50 focus:border-zim-green-500/50 font-paragraph transition-all'
                />
              </div>

              {/* Due Date */}
              <div>
                <label
                  htmlFor='task-due-date'
                  className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-paragraph'
                >
                  Due Date
                </label>
                <input
                  id='task-due-date'
                  type='date'
                  value={taskDueDate}
                  onChange={(e) => setTaskDueDate(e.target.value)}
                  className='w-full px-4 py-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zim-green-500/50 focus:border-zim-green-500/50 font-paragraph transition-all'
                />
              </div>

              {/* Priority */}
              <div>
                <label
                  htmlFor='task-priority'
                  className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-paragraph'
                >
                  Priority *
                </label>
                <div
                  onBlur={() => handleBlur('priority')}
                  className={touched.priority && errors.priority ? 'rounded-lg ring-2 ring-red-500/50' : ''}
                >
                  <SelectMenu
                    value={taskPriority}
                    onChange={(value) => {
                      setTaskPriority(value as TaskPriority)
                      if (touched.priority && errors.priority) {
                        handleBlur('priority')
                      }
                    }}
                    options={[
                      { value: 'Low', label: 'Low' },
                      { value: 'Medium', label: 'Medium' },
                      { value: 'High', label: 'High' },
                    ]}
                    placeholder='Select priority...'
                  />
                </div>
                {touched.priority && errors.priority && (
                  <div
                    id='task-priority-error'
                    role='alert'
                    className='mt-1.5 flex items-center gap-1.5 text-sm text-red-600 dark:text-red-400 font-paragraph'
                  >
                    <AlertCircle className='h-4 w-4 flex-shrink-0' aria-hidden='true' />
                    <span>{errors.priority}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className='flex items-center justify-end gap-3 mt-6'>
              <button
                type='button'
                onClick={onClose}
                disabled={isSubmitting}
                className='px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg font-buttons text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
              >
                Cancel
              </button>
              <PrimaryButton type='submit' disabled={isSubmitting}>
                {isSubmitting ? 'Adding...' : 'Add Task'}
              </PrimaryButton>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

