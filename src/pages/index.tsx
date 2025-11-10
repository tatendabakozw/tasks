import React, { useState } from 'react'
import { useRouter } from 'next/router'
import GeneralLayout from '@/layouts/general-layout'
import { Plus, Trash2, Circle, CheckCircle2, Clock, TrendingUp, User, Calendar, AlertCircle } from 'lucide-react'
import AddTaskModal from '@/components/modals/add-task-modal'
import PrimaryButton from '@/components/buttons/primary-button'
import { useTasks, TaskStatus } from '@/contexts/tasks-context'
import { format } from 'date-fns'

function index() {
  const router = useRouter()
  const { tasks, addTask, updateTask, deleteTask } = useTasks()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleTaskClick = (id: string) => {
    router.push(`/tasks/${id}`)
  }

  const getStatusCount = (status: TaskStatus) => tasks.filter(t => t.status === status).length
  
  const todoCount = getStatusCount('Todo')
  const doingCount = getStatusCount('Doing')
  const doneCount = getStatusCount('Done')
  const totalCount = tasks.length
  const completionPercentage = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0

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

  const formatDueDate = (dateString: string) => {
    if (!dateString) return 'No due date'
    try {
      const date = new Date(dateString)
      return format(date, 'MMM d, yyyy')
    } catch {
      return 'Invalid date'
    }
  }

  const isOverdue = (dateString: string) => {
    if (!dateString) return false
    try {
      const date = new Date(dateString)
      return date < new Date() && date.toDateString() !== new Date().toDateString()
    } catch {
      return false
    }
  }

  return (
    <GeneralLayout>
      <div className='max-w-7xl mx-auto w-full'>
        {/* Header Section */}
        <div className='mb-8'>
          <div className='flex items-center justify-between mb-6'>
            <div>
              <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2 font-heading'>
                My Tasks
          </h1>
              <p className='text-sm text-gray-600 dark:text-gray-400 font-paragraph'>
                {doneCount} of {totalCount} completed
              </p>
            </div>
            <PrimaryButton onClick={() => setIsModalOpen(true)} icon={Plus}>
              Add Task
            </PrimaryButton>
          </div>

          {/* Summary Analytics */}
          {totalCount > 0 && (
            <div className='grid grid-cols-2 md:grid-cols-5 gap-4 mb-6'>
              {/* Total Tasks */}
              <div className='p-4 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800'>
                <div className='flex items-center gap-3 mb-2'>
                  <div className='p-2 bg-gray-100 dark:bg-zinc-800 rounded-lg'>
                    <Circle className='h-4 w-4 text-gray-600 dark:text-gray-400' />
                  </div>
                  <span className='text-xs font-medium text-gray-600 dark:text-gray-400 font-badge uppercase tracking-wide'>
                    Total
                  </span>
                </div>
                <p className='text-2xl font-bold text-gray-900 dark:text-white font-heading'>
                  {totalCount}
                </p>
              </div>

              {/* Todo Tasks */}
              <div className='p-4 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800'>
                <div className='flex items-center gap-3 mb-2'>
                  <div className='p-2 bg-gray-100 dark:bg-zinc-800 rounded-lg'>
                    <Circle className='h-4 w-4 text-gray-600 dark:text-gray-400' />
                  </div>
                  <span className='text-xs font-medium text-gray-600 dark:text-gray-400 font-badge uppercase tracking-wide'>
                    Todo
                  </span>
                </div>
                <p className='text-2xl font-bold text-gray-900 dark:text-white font-heading'>
                  {todoCount}
                </p>
              </div>

              {/* Doing Tasks */}
              <div className='p-4 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800'>
                <div className='flex items-center gap-3 mb-2'>
                  <div className='p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg'>
                    <Clock className='h-4 w-4 text-amber-600 dark:text-amber-400' />
                  </div>
                  <span className='text-xs font-medium text-gray-600 dark:text-gray-400 font-badge uppercase tracking-wide'>
                    Doing
                  </span>
                </div>
                <p className='text-2xl font-bold text-amber-600 dark:text-amber-400 font-heading'>
                  {doingCount}
                </p>
              </div>

              {/* Done Tasks */}
              <div className='p-4 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800'>
                <div className='flex items-center gap-3 mb-2'>
                  <div className='p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg'>
                    <CheckCircle2 className='h-4 w-4 text-emerald-600 dark:text-emerald-400' />
                  </div>
                  <span className='text-xs font-medium text-gray-600 dark:text-gray-400 font-badge uppercase tracking-wide'>
                    Done
                  </span>
                </div>
                <p className='text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-heading'>
                  {doneCount}
                </p>
              </div>

              {/* Completion Rate */}
              <div className='p-4 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800'>
                <div className='flex items-center gap-3 mb-2'>
                  <div className='p-2 bg-zim-green-100 dark:bg-zim-green-900/30 rounded-lg'>
                    <TrendingUp className='h-4 w-4 text-zim-green-600 dark:text-zim-green-400' />
                  </div>
                  <span className='text-xs font-medium text-gray-600 dark:text-gray-400 font-badge uppercase tracking-wide'>
                    Progress
                  </span>
                </div>
                <p className='text-2xl font-bold text-zim-green-600 dark:text-zim-green-400 font-heading'>
                  {completionPercentage}%
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Tasks Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {tasks.length === 0 ? (
            <div className='col-span-full text-center py-12 px-4'>
              <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-zinc-800 mb-4'>
                <Circle className='h-8 w-8 text-gray-400 dark:text-gray-500' />
              </div>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2 font-heading'>
                No tasks yet
              </h3>
              <p className='text-sm text-gray-600 dark:text-gray-400 font-paragraph'>
                Get started by adding your first task
              </p>
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className='group flex flex-col p-5 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-zim-green-300 dark:hover:border-zim-green-700 transition-all cursor-pointer'
                onClick={() => handleTaskClick(task.id)}
              >
                {/* Header */}
                <div className='flex items-start justify-between mb-3'>
                  <h3
                    className={`font-paragraph font-semibold text-base flex-1 ${
                      task.status === 'Done'
                        ? 'text-gray-400 dark:text-gray-500 line-through'
                        : 'text-gray-900 dark:text-white'
                    }`}
                  >
                    {task.title}
                  </h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteTask(task.id)
                    }}
                    className='flex-shrink-0 p-1.5 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 rounded transition-colors opacity-0 group-hover:opacity-100'
                    aria-label='Delete task'
                  >
                    <Trash2 className='h-4 w-4' />
                  </button>
                </div>

                {/* Description */}
                {task.description && (
                  <p
                    className={`text-sm font-paragraph mb-4 line-clamp-2 ${
                      task.status === 'Done'
                        ? 'text-gray-400 dark:text-gray-600 line-through'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {task.description}
                  </p>
                )}

                {/* Status and Priority */}
                <div className='flex items-center gap-2 mb-3 flex-wrap'>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium font-badge ${getStatusColor(task.status)}`}
                  >
                    {task.status}
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium font-badge ${getPriorityColor(task.priority)}`}
                  >
                    {task.priority}
                  </span>
                </div>

                {/* Metadata */}
                <div className='mt-auto space-y-2 pt-3 border-t border-zinc-200 dark:border-zinc-800'>
                  {task.assignee && (
                    <div className='flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 font-paragraph'>
                      <User className='h-3.5 w-3.5' />
                      <span className='truncate'>{task.assignee}</span>
                    </div>
                  )}
                  {task.dueDate && (
                    <div className={`flex items-center gap-2 text-xs font-paragraph ${
                      isOverdue(task.dueDate) && task.status !== 'Done'
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      <Calendar className='h-3.5 w-3.5' />
                      <span>{formatDueDate(task.dueDate)}</span>
                      {isOverdue(task.dueDate) && task.status !== 'Done' && (
                        <AlertCircle className='h-3.5 w-3.5' />
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
    </div>

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addTask}
      />
    </GeneralLayout>
  )
}

export default index
