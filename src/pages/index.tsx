import React, { useState } from 'react'
import GeneralLayout from '@/layouts/general-layout'
import { Plus, Check, Trash2, Circle, CheckCircle2, Clock, TrendingUp } from 'lucide-react'
import AddTaskModal from '@/components/modals/add-task-modal'
import PrimaryButton from '@/components/buttons/primary-button'

interface Task {
  id: string
  title: string
  description: string
  completed: boolean
  createdAt: Date
}

function index() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Complete project documentation',
      description: 'Write comprehensive documentation for all project features and APIs',
      completed: false,
      createdAt: new Date(),
    },
    {
      id: '2',
      title: 'Review code changes',
      description: 'Review pull requests and provide feedback to the team',
      completed: true,
      createdAt: new Date(),
    },
  ])
  const [isModalOpen, setIsModalOpen] = useState(false)

  const addTask = (title: string, description: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      description,
      completed: false,
      createdAt: new Date(),
    }
    setTasks([newTask, ...tasks])
  }

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  const completedCount = tasks.filter(t => t.completed).length
  const inProgressCount = tasks.filter(t => !t.completed).length
  const totalCount = tasks.length
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <GeneralLayout>
      <div className='max-w-2xl mx-auto w-full'>
        {/* Header Section */}
        <div className='mb-8'>
          <div className='flex items-center justify-between mb-6'>
            <div>
              <h1 className='text-3xl font-bold text-zim-cream-900 dark:text-zim-cream-50 mb-2 font-heading'>
                My Tasks
              </h1>
              <p className='text-sm text-zim-cream-600 dark:text-zim-cream-400 font-paragraph'>
                {completedCount} of {totalCount} completed
              </p>
            </div>
            <PrimaryButton onClick={() => setIsModalOpen(true)} icon={Plus}>
              Add Task
            </PrimaryButton>
          </div>

          {/* Summary Analytics */}
          {totalCount > 0 && (
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-6'>
              {/* Total Tasks */}
              <div className='p-4 bg-white dark:bg-zim-cream-900 rounded-lg border border-zinc-200/50 dark:border-zinc-800/50'>
                <div className='flex items-center gap-3 mb-2'>
                  <div className='p-2 bg-zim-cream-100 dark:bg-zim-cream-800 rounded-lg'>
                    <Circle className='h-4 w-4 text-zim-cream-600 dark:text-zim-cream-400' />
                  </div>
                  <span className='text-xs font-medium text-zim-cream-600 dark:text-zim-cream-400 font-badge uppercase tracking-wide'>
                    Total
                  </span>
                </div>
                <p className='text-2xl font-bold text-zim-cream-900 dark:text-zim-cream-50 font-heading'>
                  {totalCount}
                </p>
              </div>

              {/* Completed Tasks */}
              <div className='p-4 bg-white dark:bg-zim-cream-900 rounded-lg border border-zinc-200/50 dark:border-zinc-800/50'>
                <div className='flex items-center gap-3 mb-2'>
                  <div className='p-2 bg-success-100 dark:bg-success-900/30 rounded-lg'>
                    <CheckCircle2 className='h-4 w-4 text-success-600 dark:text-success-400' />
                  </div>
                  <span className='text-xs font-medium text-zim-cream-600 dark:text-zim-cream-400 font-badge uppercase tracking-wide'>
                    Finished
                  </span>
                </div>
                <p className='text-2xl font-bold text-success-600 dark:text-success-400 font-heading'>
                  {completedCount}
                </p>
              </div>

              {/* In Progress Tasks */}
              <div className='p-4 bg-white dark:bg-zim-cream-900 rounded-lg border border-zinc-200/50 dark:border-zinc-800/50'>
                <div className='flex items-center gap-3 mb-2'>
                  <div className='p-2 bg-warning-100 dark:bg-warning-900/30 rounded-lg'>
                    <Clock className='h-4 w-4 text-warning-600 dark:text-warning-400' />
                  </div>
                  <span className='text-xs font-medium text-zim-cream-600 dark:text-zim-cream-400 font-badge uppercase tracking-wide'>
                    In Progress
                  </span>
                </div>
                <p className='text-2xl font-bold text-warning-600 dark:text-warning-400 font-heading'>
                  {inProgressCount}
                </p>
              </div>

              {/* Completion Rate */}
              <div className='p-4 bg-white dark:bg-zim-cream-900 rounded-lg border border-zinc-200/50 dark:border-zinc-800/50'>
                <div className='flex items-center gap-3 mb-2'>
                  <div className='p-2 bg-zim-green-100 dark:bg-zim-green-900/30 rounded-lg'>
                    <TrendingUp className='h-4 w-4 text-zim-green-600 dark:text-zim-green-400' />
                  </div>
                  <span className='text-xs font-medium text-zim-cream-600 dark:text-zim-cream-400 font-badge uppercase tracking-wide'>
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

        {/* Tasks List */}
        <div className='space-y-2'>
          {tasks.length === 0 ? (
            <div className='text-center py-12 px-4'>
              <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-zim-cream-100 dark:bg-zim-cream-800 mb-4'>
                <Circle className='h-8 w-8 text-zim-cream-400 dark:text-zim-cream-500' />
              </div>
              <h3 className='text-lg font-semibold text-zim-cream-900 dark:text-zim-cream-50 mb-2 font-heading'>
                No tasks yet
              </h3>
              <p className='text-sm text-zim-cream-600 dark:text-zim-cream-400 font-paragraph'>
                Get started by adding your first task
              </p>
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className='group flex items-start gap-3 p-4 bg-white dark:bg-zim-cream-900 rounded-lg border border-zinc-200/50 dark:border-zinc-800/50 hover:border-zim-green-300/50 dark:hover:border-zim-green-700/50 transition-all'
              >
                {/* Checkbox */}
                <button
                  onClick={() => toggleTask(task.id)}
                  className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    task.completed
                      ? 'bg-zim-green-500 border-zim-green-500'
                      : 'border-zim-cream-300 dark:border-zim-cream-600 hover:border-zim-green-400'
                  }`}
                >
                  {task.completed && (
                    <Check className='h-3 w-3 text-white' strokeWidth={3} />
                  )}
                </button>

                {/* Task Content */}
                <div className='flex-1 min-w-0'>
                  <p
                    className={`font-paragraph font-medium mb-1 ${
                      task.completed
                        ? 'text-zim-cream-500 dark:text-zim-cream-500 line-through'
                        : 'text-zim-cream-900 dark:text-zim-cream-50'
                    }`}
                  >
                    {task.title}
                  </p>
                  {task.description && (
                    <p
                      className={`text-sm font-paragraph ${
                        task.completed
                          ? 'text-zim-cream-400 dark:text-zim-cream-600 line-through'
                          : 'text-zim-cream-600 dark:text-zim-cream-400'
                      }`}
                    >
                      {task.description}
                    </p>
                  )}
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => deleteTask(task.id)}
                  className='flex-shrink-0 p-1.5 text-zim-cream-400 dark:text-zim-cream-500 hover:text-zim-red-500 dark:hover:text-zim-red-400 rounded transition-colors opacity-0 group-hover:opacity-100'
                  aria-label='Delete task'
                >
                  <Trash2 className='h-4 w-4' />
                </button>
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
