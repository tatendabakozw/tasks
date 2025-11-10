import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import GeneralLayout from '@/layouts/general-layout'
import { ArrowLeft, Trash2, Calendar, User, AlertCircle, CheckCircle2, Clock, Circle, Edit2, Save, X } from 'lucide-react'
import { useTasks, TaskStatus, TodoStatus, TaskPriority } from '@/contexts/tasks-context'
import { useTaskQuery, useUpdateTask, useDeleteTask } from '@/hooks/use-tasks-query'
import PrimaryButton from '@/components/buttons/primary-button'
import { useToast } from '@/contexts/toast-context'
import SelectMenu from '@/components/menus/select-menu'
import TaskDetailSkeleton from '@/components/skeletons/task-detail-skeleton'
import { format } from 'date-fns'
import TodoCard from '@/components/todos/todo-card'
import AddTodoForm from '@/components/todos/add-todo-form'
import { calculateTaskProgress, getSuggestedTaskStatus } from '@/utils/task-progress'
import ConfirmModal from '@/components/modals/confirm-modal'

export default function TaskDetail() {
  const router = useRouter()
  const { id } = router.query
  const { addTodo, deleteTodo, moveTodo } = useTasks()
  const { success, info, error: showError } = useToast()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState('')
  const [editedDescription, setEditedDescription] = useState('')
  const [editedAssignee, setEditedAssignee] = useState('')
  const [editedDueDate, setEditedDueDate] = useState('')
  const [editedPriority, setEditedPriority] = useState<TaskPriority>('Medium')
  const [editedStatus, setEditedStatus] = useState<TaskStatus>('Todo')

  // Fetch task from API using React Query
  const { data: task, isLoading, error } = useTaskQuery(id as string | undefined)
  const updateTaskMutation = useUpdateTask()
  const deleteTaskMutation = useDeleteTask()

  // Memoize todo counts to avoid recalculating in dependency array
  const todoStats = useMemo(() => {
    if (!task || !task.todos) {
      return { total: 0, completed: 0, inProgress: 0 }
    }
    return {
      total: task.todos.length,
      completed: task.todos.filter((t) => t.status === 'Complete').length,
      inProgress: task.todos.filter((t) => t.status === 'In Progress').length,
    }
  }, [task?.todos])

  // Calculate progress and suggested status (safe even if task is undefined)
  const progress = task ? calculateTaskProgress(task) : { percentage: 0, completed: 0, total: 0 }
  const suggestedStatus = task ? getSuggestedTaskStatus(task) : 'Todo'

  // Auto-update task status based on todos progress
  useEffect(() => {
    if (task && suggestedStatus !== task.status) {
      // Only auto-update if todos exist and status should change
      if (task.todos && task.todos.length > 0) {
        updateTaskMutation.mutate({ id: task.id, updates: { status: suggestedStatus } })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task?.id, todoStats.total, todoStats.completed, todoStats.inProgress, suggestedStatus])

  // Initialize edit form when entering edit mode
  useEffect(() => {
    if (isEditing && task) {
      setEditedTitle(task.title)
      setEditedDescription(task.description || '')
      setEditedAssignee(task.assignee || '')
      setEditedDueDate(task.dueDate ? task.dueDate.split('T')[0] : '')
      setEditedPriority(task.priority)
      setEditedStatus(task.status)
    }
  }, [isEditing, task])

  // Show loading skeleton
  if (isLoading || !router.isReady) {
    return (
      <GeneralLayout>
        <TaskDetailSkeleton />
      </GeneralLayout>
    )
  }

  // Show error or not found
  if (error || !task) {
    return (
      <GeneralLayout>
        <div className='max-w-2xl mx-auto w-full'>
          <div className='text-center py-12'>
            <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-2 font-heading'>
              {error ? 'Error loading task' : 'Task not found'}
            </h2>
            <p className='text-gray-600 dark:text-gray-400 font-paragraph mb-6'>
              {error ? 'Failed to load the task. Please try again.' : "The task you're looking for doesn't exist."}
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
    if (isEditing) {
      setEditedStatus(newStatus)
    } else {
      updateTaskMutation.mutate(
        { id: task.id, updates: { status: newStatus } },
        {
          onSuccess: () => {
            info('Status updated', `Task status changed to ${newStatus}`)
          },
          onError: () => {
            showError('Error', 'Failed to update task status')
          },
        }
      )
    }
  }

  const handleSave = async () => {
    if (!editedTitle.trim()) {
      info('Validation Error', 'Task title is required')
      return
    }

    try {
      await updateTaskMutation.mutateAsync({
        id: task.id,
        updates: {
          title: editedTitle.trim(),
          description: editedDescription.trim(),
          assignee: editedAssignee.trim(),
          dueDate: editedDueDate || new Date().toISOString().split('T')[0],
          priority: editedPriority,
          status: editedStatus,
        },
      })
      success('Task updated', 'Task has been saved successfully')
      setIsEditing(false)
    } catch (error) {
      showError('Error', 'Failed to update task')
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    // Reset to original values
    if (task) {
      setEditedTitle(task.title)
      setEditedDescription(task.description || '')
      setEditedAssignee(task.assignee || '')
      setEditedDueDate(task.dueDate ? task.dueDate.split('T')[0] : '')
      setEditedPriority(task.priority)
      setEditedStatus(task.status)
    }
  }

  const handleDelete = () => {
    setShowDeleteConfirm(true)
  }

  const confirmDelete = async () => {
    const taskTitle = task.title
    try {
      await deleteTaskMutation.mutateAsync(task.id)
      setShowDeleteConfirm(false)
      success('Task deleted', `"${taskTitle}" has been removed`)
      router.push('/')
    } catch (error) {
      showError('Error', 'Failed to delete task')
    }
  }

  const handleAddTodo = async (title: string, description?: string) => {
    try {
      await addTodo(task.id, title, description)
      success('Todo added', `"${title}" has been added`)
    } catch (error) {
      showError('Error', 'Failed to add todo. Please try again.')
    }
  }

  const handleDeleteTodo = (todoId: string) => {
    const todo = task.todos?.find(t => t.id === todoId)
    deleteTodo(task.id, todoId)
    if (todo) {
      success('Todo deleted', `"${todo.title}" has been removed`)
    }
  }

  const handleMoveTodo = (todoId: string, newStatus: TodoStatus) => {
    const todo = task.todos?.find(t => t.id === todoId)
    moveTodo(task.id, todoId, newStatus)
    if (todo) {
      info('Todo updated', `"${todo.title}" moved to ${newStatus}`)
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
      <div className='max-w-7xl mx-auto w-full'>
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
              {isEditing ? (
                <input
                  type='text'
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className='w-full text-3xl font-bold mb-4 font-heading bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zim-green-500/50 focus:border-zim-green-500/50'
                  placeholder='Task title...'
                  autoFocus
                />
              ) : (
                <h1
                  className={`text-3xl font-bold mb-4 font-heading ${
                    task.status === 'Done'
                      ? 'text-gray-400 dark:text-gray-500 line-through'
                      : 'text-gray-900 dark:text-white'
                  }`}
                >
                  {task.title}
                </h1>
              )}
              <div className='flex items-center gap-4 flex-wrap'>
                <div className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 font-paragraph'>
                  <Calendar className='h-4 w-4' />
                  <span>Created {formattedCreatedDate}</span>
                </div>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className='flex-shrink-0 p-2 text-gray-400 dark:text-gray-500 hover:text-zim-green-600 dark:hover:text-zim-green-400 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-zinc-800'
                    aria-label='Save changes'
                  >
                    <Save className='h-5 w-5' />
                  </button>
                  <button
                    onClick={handleCancel}
                    className='flex-shrink-0 p-2 text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-zinc-800'
                    aria-label='Cancel editing'
                  >
                    <X className='h-5 w-5' />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className='flex-shrink-0 p-2 text-gray-400 dark:text-gray-500 hover:text-zim-green-600 dark:hover:text-zim-green-400 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-zinc-800'
                    aria-label='Edit task'
                  >
                    <Edit2 className='h-5 w-5' />
                  </button>
                  <button
                    onClick={handleDelete}
                    className='flex-shrink-0 p-2 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-zinc-800'
                    aria-label='Delete task'
                  >
                    <Trash2 className='h-5 w-5' />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Status and Priority Badges */}
          <div className='flex items-center gap-3 mb-6 flex-wrap'>
            {isEditing ? (
              <>
                <div className='flex items-center gap-2'>
                  <label className='text-xs font-medium text-gray-600 dark:text-gray-400 font-badge'>
                    Status:
                  </label>
                  <SelectMenu
                    value={editedStatus}
                    onChange={(value) => setEditedStatus(value as TaskStatus)}
                    options={[
                      { value: 'Todo', label: 'Todo' },
                      { value: 'Doing', label: 'Doing' },
                      { value: 'Done', label: 'Done' },
                    ]}
                    size='sm'
                    variant='compact'
                    className='min-w-[120px]'
                  />
                </div>
                <div className='flex items-center gap-2'>
                  <label className='text-xs font-medium text-gray-600 dark:text-gray-400 font-badge'>
                    Priority:
                  </label>
                  <SelectMenu
                    value={editedPriority}
                    onChange={(value) => setEditedPriority(value as TaskPriority)}
                    options={[
                      { value: 'Low', label: 'Low' },
                      { value: 'Medium', label: 'Medium' },
                      { value: 'High', label: 'High' },
                    ]}
                    size='sm'
                    variant='compact'
                    className='min-w-[120px]'
                  />
                </div>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>

          {/* Progress Bar */}
          {progress.total > 0 && (
            <div className='mb-6'>
              <div className='flex items-center justify-between mb-2'>
                <span className='text-sm font-medium text-gray-700 dark:text-gray-300 font-subheading'>
                  Progress
                </span>
                <span className='text-sm font-medium text-gray-600 dark:text-gray-400 font-paragraph'>
                  {progress.completed} of {progress.total} todos completed ({progress.percentage}%)
                </span>
              </div>
              <div className='w-full bg-gray-200 dark:bg-zinc-800 rounded-full h-2.5'>
                <div
                  className='bg-zim-green-500 h-2.5 rounded-full transition-all duration-300'
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>
            </div>
          )}

          {/* Description */}
          <div className='mb-6'>
            <h2 className='text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 font-subheading uppercase tracking-wide'>
              Description
            </h2>
            {isEditing ? (
              <textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                placeholder='Add a description...'
                rows={6}
                className='w-full px-4 py-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-lg text-base text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-zim-green-500/50 focus:border-zim-green-500/50 font-paragraph resize-none leading-relaxed'
              />
            ) : (
              task.description ? (
                <p
                  className={`text-base font-paragraph leading-relaxed ${
                    task.status === 'Done'
                      ? 'text-gray-400 dark:text-gray-600 line-through'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {task.description}
                </p>
              ) : (
                <p className='text-base font-paragraph text-gray-400 dark:text-gray-500 italic'>
                  No description
                </p>
              )
            )}
          </div>

          {/* Task Details */}
          <div className='space-y-4 pt-6 border-t border-zinc-200 dark:border-zinc-800'>
            {/* Assignee */}
            <div className='flex items-center gap-3'>
              <User className='h-5 w-5 text-gray-600 dark:text-gray-400' />
              <div className='flex-1'>
                <p className='text-xs font-medium text-gray-600 dark:text-gray-400 font-badge uppercase tracking-wide mb-1'>
                  Assignee
                </p>
                {isEditing ? (
                  <input
                    type='text'
                    value={editedAssignee}
                    onChange={(e) => setEditedAssignee(e.target.value)}
                    placeholder='Enter assignee name...'
                    className='w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-lg text-base text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-zim-green-500/50 focus:border-zim-green-500/50 font-paragraph'
                  />
                ) : (
                  <p className='text-base font-paragraph text-gray-900 dark:text-white'>
                    {task.assignee || 'Unassigned'}
                  </p>
                )}
              </div>
            </div>

            {/* Due Date */}
            <div className='flex items-center gap-3'>
              <Calendar className={`h-5 w-5 ${isOverdue && !isEditing ? 'text-red-500 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`} />
              <div className='flex-1'>
                <p className='text-xs font-medium text-gray-600 dark:text-gray-400 font-badge uppercase tracking-wide mb-1'>
                  Due Date
                </p>
                {isEditing ? (
                  <input
                    type='date'
                    value={editedDueDate}
                    onChange={(e) => setEditedDueDate(e.target.value)}
                    className='w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-lg text-base text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zim-green-500/50 focus:border-zim-green-500/50 font-paragraph'
                  />
                ) : (
                  <div className='flex items-center gap-2'>
                    <p className={`text-base font-paragraph ${isOverdue ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
                      {formattedDueDate || 'No due date'}
                    </p>
                    {isOverdue && !isEditing && (
                      <AlertCircle className='h-4 w-4 text-red-500 dark:text-red-400' />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Status Change Actions - Only show when not editing */}
          {!isEditing && (
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
          )}
        </div>

        {/* Todos Kanban Board */}
        <div className='mt-8'>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-2xl font-semibold text-gray-900 dark:text-white font-heading'>
              Todos
            </h2>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            {/* Pending Column */}
            <div className='flex flex-col'>
              <div className='bg-gray-100 dark:bg-zinc-800 rounded-t-lg px-4 py-3 border-b border-zinc-200 dark:border-zinc-700'>
                <h3 className='text-sm font-semibold text-gray-700 dark:text-gray-300 font-subheading'>
                  Pending
                </h3>
                <p className='text-xs text-gray-500 dark:text-gray-500 mt-1'>
                  {(task.todos || []).filter((t) => t.status === 'Pending').length} items
                </p>
              </div>
              <div className='bg-gray-50 dark:bg-zinc-900 rounded-b-lg p-3 space-y-3 min-h-[200px]'>
                {(task.todos || [])
                  .filter((t) => t.status === 'Pending')
                  .map((todo) => (
                    <TodoCard
                      key={todo.id}
                      todo={todo}
                      onDelete={() => handleDeleteTodo(todo.id)}
                      onStatusChange={(newStatus) => handleMoveTodo(todo.id, newStatus)}
                    />
                  ))}
                <AddTodoForm
                  onAdd={handleAddTodo}
                />
              </div>
            </div>

            {/* Todo Column */}
            <div className='flex flex-col'>
              <div className='bg-blue-100 dark:bg-blue-900/30 rounded-t-lg px-4 py-3 border-b border-blue-200 dark:border-blue-800'>
                <h3 className='text-sm font-semibold text-blue-700 dark:text-blue-400 font-subheading'>
                  Todo
                </h3>
                <p className='text-xs text-blue-600 dark:text-blue-500 mt-1'>
                  {(task.todos || []).filter((t) => t.status === 'Todo').length} items
                </p>
              </div>
              <div className='bg-gray-50 dark:bg-zinc-900 rounded-b-lg p-3 space-y-3 min-h-[200px]'>
                {(task.todos || [])
                  .filter((t) => t.status === 'Todo')
                  .map((todo) => (
                    <TodoCard
                      key={todo.id}
                      todo={todo}
                      onDelete={() => handleDeleteTodo(todo.id)}
                      onStatusChange={(newStatus) => handleMoveTodo(todo.id, newStatus)}
                    />
                  ))}
              </div>
            </div>

            {/* In Progress Column */}
            <div className='flex flex-col'>
              <div className='bg-amber-100 dark:bg-amber-900/30 rounded-t-lg px-4 py-3 border-b border-amber-200 dark:border-amber-800'>
                <h3 className='text-sm font-semibold text-amber-700 dark:text-amber-400 font-subheading'>
                  In Progress
                </h3>
                <p className='text-xs text-amber-600 dark:text-amber-500 mt-1'>
                  {(task.todos || []).filter((t) => t.status === 'In Progress').length} items
                </p>
              </div>
              <div className='bg-gray-50 dark:bg-zinc-900 rounded-b-lg p-3 space-y-3 min-h-[200px]'>
                {(task.todos || [])
                  .filter((t) => t.status === 'In Progress')
                  .map((todo) => (
                    <TodoCard
                      key={todo.id}
                      todo={todo}
                      onDelete={() => handleDeleteTodo(todo.id)}
                      onStatusChange={(newStatus) => handleMoveTodo(todo.id, newStatus)}
                    />
                  ))}
              </div>
            </div>

            {/* Complete Column */}
            <div className='flex flex-col'>
              <div className='bg-emerald-100 dark:bg-emerald-900/30 rounded-t-lg px-4 py-3 border-b border-emerald-200 dark:border-emerald-800'>
                <h3 className='text-sm font-semibold text-emerald-700 dark:text-emerald-400 font-subheading'>
                  Complete
                </h3>
                <p className='text-xs text-emerald-600 dark:text-emerald-500 mt-1'>
                  {(task.todos || []).filter((t) => t.status === 'Complete').length} items
                </p>
              </div>
              <div className='bg-gray-50 dark:bg-zinc-900 rounded-b-lg p-3 space-y-3 min-h-[200px]'>
                {(task.todos || [])
                  .filter((t) => t.status === 'Complete')
                  .map((todo) => (
                    <TodoCard
                      key={todo.id}
                      todo={todo}
                      onDelete={() => handleDeleteTodo(todo.id)}
                      onStatusChange={(newStatus) => handleMoveTodo(todo.id, newStatus)}
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {task && (
        <ConfirmModal
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={confirmDelete}
          title='Delete Task'
          message={`Are you sure you want to delete "${task.title}"? This action cannot be undone.`}
          confirmText='Delete'
          cancelText='Cancel'
          variant='danger'
        />
      )}
    </GeneralLayout>
  )
}

