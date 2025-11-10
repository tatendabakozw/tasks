import React, { useEffect } from 'react'
import { X } from 'lucide-react'
import PrimaryButton from '@/components/buttons/primary-button'
import { TaskStatus, TaskPriority } from '@/contexts/tasks-context'
import SelectMenu from '@/components/menus/select-menu'

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
  }) => void
}

export default function AddTaskModal({ isOpen, onClose, onAdd }: AddTaskModalProps) {
  const [taskTitle, setTaskTitle] = React.useState('')
  const [taskDescription, setTaskDescription] = React.useState('')
  const [taskStatus, setTaskStatus] = React.useState<TaskStatus>('Todo')
  const [taskAssignee, setTaskAssignee] = React.useState('')
  const [taskDueDate, setTaskDueDate] = React.useState('')
  const [taskPriority, setTaskPriority] = React.useState<TaskPriority>('Medium')

  useEffect(() => {
    if (isOpen) {
      setTaskTitle('')
      setTaskDescription('')
      setTaskStatus('Todo')
      setTaskAssignee('')
      setTaskDueDate('')
      setTaskPriority('Medium')
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
      onAdd({
        title: taskTitle.trim(),
        description: taskDescription.trim(),
        status: taskStatus,
        assignee: taskAssignee.trim(),
        dueDate: taskDueDate || new Date().toISOString().split('T')[0],
        priority: taskPriority,
      })
      setTaskTitle('')
      setTaskDescription('')
      setTaskStatus('Todo')
      setTaskAssignee('')
      setTaskDueDate('')
      setTaskPriority('Medium')
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
          className='w-full max-w-md bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-xl transform transition-all'
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className='flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800'>
            <h2 className='text-xl font-semibold text-gray-900 dark:text-white font-heading'>
              Add New Task
            </h2>
            <button
              onClick={onClose}
              className='p-1.5 text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-zinc-800'
              aria-label='Close modal'
            >
              <X className='h-5 w-5' />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className='p-6'>
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
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder='What needs to be done?'
                  className='w-full px-4 py-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-zim-green-500/50 focus:border-zim-green-500/50 font-paragraph transition-all'
                  autoFocus
                  required
                />
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
                <SelectMenu
                  value={taskStatus}
                  onChange={(value) => setTaskStatus(value as TaskStatus)}
                  options={[
                    { value: 'Todo', label: 'Todo' },
                    { value: 'Doing', label: 'Doing' },
                    { value: 'Done', label: 'Done' },
                  ]}
                  placeholder='Select status...'
                />
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
                <SelectMenu
                  value={taskPriority}
                  onChange={(value) => setTaskPriority(value as TaskPriority)}
                  options={[
                    { value: 'Low', label: 'Low' },
                    { value: 'Medium', label: 'Medium' },
                    { value: 'High', label: 'High' },
                  ]}
                  placeholder='Select priority...'
                />
              </div>
            </div>

            {/* Actions */}
            <div className='flex items-center justify-end gap-3'>
              <button
                type='button'
                onClick={onClose}
                className='px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg font-buttons text-sm font-medium transition-colors'
              >
                Cancel
              </button>
              <PrimaryButton type='submit'>
                Add Task
              </PrimaryButton>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

