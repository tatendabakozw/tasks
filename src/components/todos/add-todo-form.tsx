import React, { useState } from 'react'
import { Plus, X } from 'lucide-react'
import PrimaryButton from '@/components/buttons/primary-button'

interface AddTodoFormProps {
  onAdd: (title: string, description?: string) => void
  onCancel?: () => void
}

export default function AddTodoForm({ onAdd, onCancel }: AddTodoFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      onAdd(title.trim(), description.trim() || undefined)
      setTitle('')
      setDescription('')
      setIsExpanded(false)
    }
  }

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className='w-full p-3 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg text-gray-600 dark:text-gray-400 hover:border-zim-green-400 dark:hover:border-zim-green-600 hover:text-zim-green-600 dark:hover:text-zim-green-400 transition-colors flex items-center justify-center gap-2'
      >
        <Plus className='h-4 w-4' />
        <span className='text-sm font-paragraph'>Add Todo</span>
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className='bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 space-y-3'>
      <div>
        <input
          type='text'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder='Todo title...'
          className='w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-zim-green-500/50 focus:border-zim-green-500/50 font-paragraph'
          autoFocus
          required
        />
      </div>
      <div>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder='Description (optional)...'
          rows={2}
          className='w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-zim-green-500/50 focus:border-zim-green-500/50 font-paragraph resize-none'
        />
      </div>
      <div className='flex items-center gap-2'>
        <PrimaryButton type='submit' size='sm' className='flex-1'>
          Add
        </PrimaryButton>
        <button
          type='button'
          onClick={() => {
            setIsExpanded(false)
            setTitle('')
            setDescription('')
            onCancel?.()
          }}
          className='px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors'
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

