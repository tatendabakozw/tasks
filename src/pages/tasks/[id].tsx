import React from 'react'
import { useRouter } from 'next/router'
import GeneralLayout from '@/layouts/general-layout'
import { ArrowLeft, Trash2, Calendar, User, AlertCircle, CheckCircle2, Clock, Circle } from 'lucide-react'
import { useTasks, TaskStatus } from '@/contexts/tasks-context'
import PrimaryButton from '@/components/buttons/primary-button'
import { format } from 'date-fns'

export default function TaskDetail() {
  const router = useRouter()
  const { id } = router.query
  const { getTask, updateTask, deleteTask } = useTasks()
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    if (router.isReady) {
      setIsLoading(false)
    }
  }, [router.isReady])

  const task = id && router.isReady ? getTask(id as string) : undefined

  if (isLoading || !router.isReady) {
    return (
      <GeneralLayout>
        <div className='max-w-2xl mx-auto w-full'>
          <div className='text-center py-12'>
            <p className='text-gray-600 dark:text-gray-400 font-paragraph'>
              Loading...
            </p>
          </div>
        </div>
      </GeneralLayout>
    )
  }

  if (!task) {
    return (
      <GeneralLayout>
        <div className='max-w-2xl mx-auto w-full'>
          <div className='text-center py-12'>
            <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-2 font-heading'>
              Task not found
            </h2>
            <p className='text-gray-600 dark:text-gray-400 font-paragraph mb-6'>
              The task you're looking for doesn't exist.
            </p>
            <PrimaryButton onClick={() => router.push('/')} icon={ArrowLeft} iconPosition='left'>
              Back to Tasks
            </PrimaryButton>
          </div>
        </div>
      </GeneralLayout>
    )
  }

  const handleStatusChange = (newStatus: TaskStatus) => {
    updateTask(task.id, { status: newStatus })
  }

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this task?')) {
      deleteTask(task.id)
      router.push('/')
    }
  }

  const formattedCreatedDate = format(new Date(task.createdAt), 'PPP')
  const formattedDueDate = task.dueDate ? format(new Date(task.dueDate), 'PPP') : null
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Done'

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'Todo':
        return 'bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300'
      case 'Doing':
        return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
      case 'Done':
        return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
      case 'Medium':
        return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
      case 'Low':
        return 'bg-zim-green-100 dark:bg-zim-green-900/30 text-zim-green-700 dark:text-zim-green-400'
      default:
        return 'bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300'
    }
  }

  return (
    <GeneralLayout>
      <div className='max-w-3xl mx-auto w-full'>
        {/* Back Button */}
        <button
          onClick={() => router.push('/')}
          className='flex items-center gap-2 mb-6 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors font-paragraph'
        >
          <ArrowLeft className='h-4 w-4' />
          Back to Tasks
        </button>

        {/* Task Card */}
        <div className='bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6 md:p-8'>
          {/* Header */}
          <div className='flex items-start justify-between mb-6'>
            <div className='flex-1 min-w-0'>
              <h1
                  className={`text-3xl font-bold mb-4 font-heading ${
                    task.status === 'Done'
                      ? 'text-gray-400 dark:text-gray-500 line-through'
                      : 'text-gray-900 dark:text-white'
                  }`}
              >
                {task.title}
              </h1>
              <div className='flex items-center gap-4 flex-wrap'>
                <div className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 font-paragraph'>
                  <Calendar className='h-4 w-4' />
                  <span>Created {formattedCreatedDate}</span>
                </div>
              </div>
            </div>
            <button
              onClick={handleDelete}
              className='flex-shrink-0 p-2 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-zinc-800'
              aria-label='Delete task'
            >
              <Trash2 className='h-5 w-5' />
            </button>
          </div>

          {/* Status and Priority Badges */}
          <div className='flex items-center gap-3 mb-6 flex-wrap'>
            <span
              className={`px-3 py-1.5 rounded-full text-xs font-medium font-badge ${getStatusColor(task.status)}`}
            >
              {task.status}
            </span>
            <span
              className={`px-3 py-1.5 rounded-full text-xs font-medium font-badge ${getPriorityColor(task.priority)}`}
            >
              {task.priority} Priority
            </span>
          </div>

          {/* Description */}
          {task.description && (
            <div className='mb-6'>
              <h2 className='text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 font-subheading uppercase tracking-wide'>
                Description
              </h2>
              <p
                className={`text-base font-paragraph leading-relaxed ${
                  task.status === 'Done'
                    ? 'text-gray-400 dark:text-gray-600 line-through'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {task.description}
              </p>
            </div>
          )}

          {/* Task Details */}
          <div className='space-y-4 pt-6 border-t border-zinc-200 dark:border-zinc-800'>
            {task.assignee && (
              <div className='flex items-center gap-3'>
                <User className='h-5 w-5 text-gray-600 dark:text-gray-400' />
                <div>
                  <p className='text-xs font-medium text-gray-600 dark:text-gray-400 font-badge uppercase tracking-wide mb-1'>
                    Assignee
                  </p>
                  <p className='text-base font-paragraph text-gray-900 dark:text-white'>
                    {task.assignee}
                  </p>
                </div>
              </div>
            )}

            {formattedDueDate && (
              <div className='flex items-center gap-3'>
                <Calendar className={`h-5 w-5 ${isOverdue ? 'text-red-500 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`} />
                <div>
                  <p className='text-xs font-medium text-gray-600 dark:text-gray-400 font-badge uppercase tracking-wide mb-1'>
                    Due Date
                  </p>
                  <div className='flex items-center gap-2'>
                    <p className={`text-base font-paragraph ${isOverdue ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
                      {formattedDueDate}
                    </p>
                    {isOverdue && (
                      <AlertCircle className='h-4 w-4 text-red-500 dark:text-red-400' />
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Status Change Actions */}
          <div className='mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800'>
            <p className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 font-subheading'>
              Change Status
            </p>
            <div className='flex items-center gap-2 flex-wrap'>
              <button
                onClick={() => handleStatusChange('Todo')}
                className={`px-4 py-2 rounded-lg text-sm font-medium font-buttons transition-colors ${
                  task.status === 'Todo'
                    ? 'bg-gray-200 dark:bg-zinc-700 text-gray-900 dark:text-white'
                    : 'bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700'
                }`}
              >
                <Circle className='h-4 w-4 inline mr-2' />
                Todo
              </button>
              <button
                onClick={() => handleStatusChange('Doing')}
                className={`px-4 py-2 rounded-lg text-sm font-medium font-buttons transition-colors ${
                  task.status === 'Doing'
                    ? 'bg-amber-200 dark:bg-amber-700 text-amber-900 dark:text-amber-50'
                    : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-700'
                }`}
              >
                <Clock className='h-4 w-4 inline mr-2' />
                Doing
              </button>
              <button
                onClick={() => handleStatusChange('Done')}
                className={`px-4 py-2 rounded-lg text-sm font-medium font-buttons transition-colors ${
                  task.status === 'Done'
                    ? 'bg-emerald-200 dark:bg-emerald-700 text-emerald-900 dark:text-emerald-50'
                    : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-700'
                }`}
              >
                <CheckCircle2 className='h-4 w-4 inline mr-2' />
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    </GeneralLayout>
  )
}

