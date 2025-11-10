import React, { useState, useMemo } from 'react'
import { useRouter } from 'next/router'
import GeneralLayout from '@/layouts/general-layout'
import { Plus, Trash2, Circle, CheckCircle2, Clock, TrendingUp, User, Calendar, AlertCircle, Search, X, Filter, ArrowUpDown } from 'lucide-react'
import AddTaskModal from '@/components/modals/add-task-modal'
import ConfirmModal from '@/components/modals/confirm-modal'
import PrimaryButton from '@/components/buttons/primary-button'
import SelectMenu from '@/components/menus/select-menu'
import TaskCardSkeleton from '@/components/skeletons/task-card-skeleton'
import AnalyticsSkeleton from '@/components/skeletons/analytics-skeleton'
import { useTasks, TaskStatus, TaskPriority } from '@/contexts/tasks-context'
import { useToast } from '@/contexts/toast-context'
import { format } from 'date-fns'
import { calculateTaskProgress } from '@/utils/task-progress'

type SortOption = 'dueDate-asc' | 'dueDate-desc' | 'priority-asc' | 'priority-desc' | 'none'

function index() {
  const router = useRouter()
  const { tasks, isLoading, addTask, updateTask, deleteTask } = useTasks()
  const { success, error } = useToast()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<SortOption>('none')

  const handleTaskClick = (id: string) => {
    router.push(`/tasks/${id}`)
  }

  // Get unique assignees from tasks
  const uniqueAssignees = useMemo(() => {
    const assignees = tasks
      .map(t => t.assignee)
      .filter(Boolean)
      .filter((value, index, self) => self.indexOf(value) === index)
      .sort()
    return assignees
  }, [tasks])

  // Filter and sort tasks
  const filteredAndSortedTasks = useMemo(() => {
    let filtered = [...tasks]

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        task =>
          task.title.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query) ||
          task.assignee.toLowerCase().includes(query)
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(task => task.status === statusFilter)
    }

    // Assignee filter
    if (assigneeFilter !== 'all') {
      filtered = filtered.filter(task => task.assignee === assigneeFilter)
    }

    // Sort
    if (sortBy !== 'none') {
      filtered.sort((a, b) => {
        switch (sortBy) {
          case 'dueDate-asc': {
            if (!a.dueDate && !b.dueDate) return 0
            if (!a.dueDate) return 1
            if (!b.dueDate) return -1
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
          }
          case 'dueDate-desc': {
            if (!a.dueDate && !b.dueDate) return 0
            if (!a.dueDate) return 1
            if (!b.dueDate) return -1
            return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
          }
          case 'priority-asc': {
            const priorityOrder: Record<TaskPriority, number> = { Low: 1, Medium: 2, High: 3 }
            return priorityOrder[a.priority] - priorityOrder[b.priority]
          }
          case 'priority-desc': {
            const priorityOrder: Record<TaskPriority, number> = { Low: 1, Medium: 2, High: 3 }
            return priorityOrder[b.priority] - priorityOrder[a.priority]
          }
          default:
            return 0
        }
      })
    }

    return filtered
  }, [tasks, searchQuery, statusFilter, assigneeFilter, sortBy])

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
          {isLoading ? (
            <AnalyticsSkeleton />
          ) : totalCount > 0 ? (
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
          ) : null}
        </div>

        {/* Search and Filters */}
        {!isLoading && tasks.length > 0 && (
          <div className='mb-6 space-y-4'>
            {/* Search Bar */}
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500' />
              <input
                type='text'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Search tasks by title, description, or assignee...'
                className='w-full pl-10 pr-10 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-zim-green-500/50 focus:border-zim-green-500/50 font-paragraph'
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className='absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 rounded transition-colors'
                  aria-label='Clear search'
                >
                  <X className='h-4 w-4' />
                </button>
              )}
            </div>

            {/* Filters and Sort */}
            <div className='flex flex-wrap items-center gap-3'>
              {/* Status Filter */}
              <div className='flex items-center gap-2'>
                <Filter className='h-4 w-4 text-gray-500 dark:text-gray-400' />
                <SelectMenu
                  value={statusFilter}
                  onChange={setStatusFilter}
                  options={[
                    { value: 'all', label: 'All Status' },
                    { value: 'Todo', label: 'Todo' },
                    { value: 'Doing', label: 'Doing' },
                    { value: 'Done', label: 'Done' },
                  ]}
                  placeholder='Filter by status'
                  size='sm'
                  variant='compact'
                  className='min-w-[140px]'
                />
              </div>

              {/* Assignee Filter */}
              {uniqueAssignees.length > 0 && (
                <SelectMenu
                  value={assigneeFilter}
                  onChange={setAssigneeFilter}
                  options={[
                    { value: 'all', label: 'All Assignees' },
                    ...uniqueAssignees.map(assignee => ({
                      value: assignee,
                      label: assignee,
                    })),
                  ]}
                  placeholder='Filter by assignee'
                  size='sm'
                  variant='compact'
                  className='min-w-[160px]'
                />
              )}

              {/* Sort */}
              <div className='flex items-center gap-2 ml-auto'>
                <ArrowUpDown className='h-4 w-4 text-gray-500 dark:text-gray-400' />
                <SelectMenu
                  value={sortBy}
                  onChange={(value) => setSortBy(value as SortOption)}
                  options={[
                    { value: 'none', label: 'No sorting' },
                    { value: 'dueDate-asc', label: 'Due Date (Earliest)' },
                    { value: 'dueDate-desc', label: 'Due Date (Latest)' },
                    { value: 'priority-asc', label: 'Priority (Low to High)' },
                    { value: 'priority-desc', label: 'Priority (High to Low)' },
                  ]}
                  placeholder='Sort by...'
                  size='sm'
                  variant='compact'
                  className='min-w-[180px]'
                />
              </div>

              {/* Clear Filters */}
              {(searchQuery || statusFilter !== 'all' || assigneeFilter !== 'all' || sortBy !== 'none') && (
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setStatusFilter('all')
                    setAssigneeFilter('all')
                    setSortBy('none')
                  }}
                  className='px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors font-paragraph'
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Results count */}
            {filteredAndSortedTasks.length !== tasks.length && (
              <p className='text-sm text-gray-600 dark:text-gray-400 font-paragraph'>
                Showing {filteredAndSortedTasks.length} of {tasks.length} tasks
              </p>
            )}
          </div>
        )}

        {/* Tasks Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {isLoading ? (
            // Show skeleton loaders
            <>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <TaskCardSkeleton key={i} />
              ))}
            </>
          ) : filteredAndSortedTasks.length === 0 ? (
            <div className='col-span-full text-center py-12 px-4'>
              <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-zinc-800 mb-4'>
                <Circle className='h-8 w-8 text-gray-400 dark:text-gray-500' />
              </div>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2 font-heading'>
                {tasks.length === 0 ? 'No tasks yet' : 'No tasks found'}
              </h3>
              <p className='text-sm text-gray-600 dark:text-gray-400 font-paragraph'>
                {tasks.length === 0
                  ? 'Get started by adding your first task'
                  : 'Try adjusting your search or filters'}
              </p>
            </div>
          ) : (
            filteredAndSortedTasks.map((task) => (
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
                      setTaskToDelete(task.id)
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

                {/* Progress Bar */}
                {(() => {
                  const progress = calculateTaskProgress(task)
                  return progress.total > 0 ? (
                    <div className='mb-3'>
                      <div className='flex items-center justify-between mb-1.5'>
                        <span className='text-xs font-medium text-gray-600 dark:text-gray-400 font-paragraph'>
                          Progress
                        </span>
                        <span className='text-xs font-medium text-gray-600 dark:text-gray-400 font-paragraph'>
                          {progress.percentage}%
                        </span>
                      </div>
                      <div className='w-full bg-gray-200 dark:bg-zinc-800 rounded-full h-1.5'>
                        <div
                          className='bg-zim-green-500 h-1.5 rounded-full transition-all duration-300'
                          style={{ width: `${progress.percentage}%` }}
                        />
                      </div>
                    </div>
                  ) : null
                })()}

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

      {/* Delete Confirmation Modal */}
      {taskToDelete && (
        <ConfirmModal
          isOpen={!!taskToDelete}
          onClose={() => setTaskToDelete(null)}
          onConfirm={async () => {
            const task = tasks.find(t => t.id === taskToDelete)
            try {
              await deleteTask(taskToDelete)
              setTaskToDelete(null)
              if (task) {
                success('Task deleted', `"${task.title}" has been removed`)
              }
            } catch (err) {
              error('Error', 'Failed to delete task')
            }
          }}
          title='Delete Task'
          message={`Are you sure you want to delete "${tasks.find(t => t.id === taskToDelete)?.title}"? This action cannot be undone.`}
          confirmText='Delete'
          cancelText='Cancel'
          variant='danger'
        />
      )}
    </GeneralLayout>
  )
}

export default index
