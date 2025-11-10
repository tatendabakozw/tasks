import React, { useState } from 'react'
import GeneralLayout from '@/layouts/general-layout'
import { Plus, Check, Trash2, Circle } from 'lucide-react'
import AddTaskModal from '@/components/modals/add-task-modal'

interface Task {
  id: string
  title: string
  completed: boolean
  createdAt: Date
}

function index() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Complete project documentation',
      completed: false,
      createdAt: new Date(),
    },
    {
      id: '2',
      title: 'Review code changes',
      completed: true,
      createdAt: new Date(),
    },
  ])
  const [isModalOpen, setIsModalOpen] = useState(false)

  const addTask = (title: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
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
  const totalCount = tasks.length

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
            <button
              onClick={() => setIsModalOpen(true)}
              className='flex items-center gap-2 px-4 py-2.5 bg-zim-green-500 hover:bg-zim-green-600 text-white rounded-lg font-buttons text-sm font-medium transition-colors shadow-sm hover:shadow-md'
            >
              <Plus className='h-4 w-4' />
              Add Task
            </button>
          </div>
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
                className='group flex items-center gap-3 p-4 bg-white dark:bg-zim-cream-900 rounded-lg border border-zinc-200/50 dark:border-zinc-800/50 hover:border-zim-green-300/50 dark:hover:border-zim-green-700/50 transition-all'
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

                {/* Task Title */}
                <div className='flex-1 min-w-0'>
                  <p
                    className={`font-paragraph ${
                      task.completed
                        ? 'text-zim-cream-500 dark:text-zim-cream-500 line-through'
                        : 'text-zim-cream-900 dark:text-zim-cream-50'
                    }`}
                  >
                    {task.title}
                  </p>
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
