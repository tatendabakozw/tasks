import React from 'react'
import { Trash2, GripVertical } from 'lucide-react'
import { TodoItem, TodoStatus } from '@/contexts/tasks-context'
import SelectMenu from '@/components/menus/select-menu'

interface TodoCardProps {
  todo: TodoItem
  onDelete: () => void
  onStatusChange: (newStatus: TodoStatus) => void
}

export default function TodoCard({ todo, onDelete, onStatusChange }: TodoCardProps) {
  const getStatusColor = (status: TodoStatus) => {
    switch (status) {
      case 'Pending':
        return 'bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300'
      case 'Todo':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
      case 'In Progress':
        return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
      case 'Complete':
        return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
    }
  }

  return (
    <div className='group bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 hover:shadow-md transition-all'>
      <div className='flex items-start justify-between mb-2'>
        <div className='flex items-start gap-2 flex-1'>
          <button
            className='cursor-move text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity'
            aria-label='Drag handle'
          >
            <GripVertical className='h-4 w-4' />
          </button>
          <h4
            className={`font-paragraph font-medium text-sm flex-1 ${
              todo.status === 'Complete'
                ? 'text-gray-400 dark:text-gray-500 line-through'
                : 'text-gray-900 dark:text-white'
            }`}
          >
            {todo.title}
          </h4>
        </div>
        <button
          onClick={onDelete}
          className='flex-shrink-0 p-1 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 rounded transition-colors opacity-0 group-hover:opacity-100'
          aria-label='Delete todo'
        >
          <Trash2 className='h-3.5 w-3.5' />
        </button>
      </div>

      {todo.description && (
        <p
          className={`text-xs font-paragraph mb-3 line-clamp-2 ${
            todo.status === 'Complete'
              ? 'text-gray-400 dark:text-gray-600 line-through'
              : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          {todo.description}
        </p>
      )}

      <div className='flex items-center gap-2'>
        <span
          className={`px-2 py-0.5 rounded-md text-xs font-medium font-badge ${getStatusColor(todo.status)}`}
        >
          {todo.status}
        </span>
        <div className='flex-1' />
        <div onClick={(e) => e.stopPropagation()}>
          <SelectMenu
            value={todo.status}
            onChange={(value) => onStatusChange(value as TodoStatus)}
            options={[
              { value: 'Pending', label: 'Pending' },
              { value: 'Todo', label: 'Todo' },
              { value: 'In Progress', label: 'In Progress' },
              { value: 'Complete', label: 'Complete' },
            ]}
            size='sm'
            variant='compact'
            className='min-w-[120px]'
          />
        </div>
      </div>
    </div>
  )
}

