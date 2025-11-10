import React, { createContext, useContext, useState, useEffect } from 'react'

export type TaskStatus = 'Todo' | 'Doing' | 'Done'
export type TaskPriority = 'Low' | 'Medium' | 'High'

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  assignee: string
  dueDate: string // ISO date string
  priority: TaskPriority
  createdAt: Date
}

interface TasksContextType {
  tasks: Task[]
  addTask: (task: {
    title: string
    description: string
    status: TaskStatus
    assignee: string
    dueDate: string
    priority: TaskPriority
  }) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  getTask: (id: string) => Task | undefined
}

const TasksContext = createContext<TasksContextType | undefined>(undefined)

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([])

  // Load tasks from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('tasks')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        // Convert createdAt strings back to Date objects and migrate old format
        const tasksWithDates = parsed.map((task: any) => {
          // Migrate old tasks with 'completed' field to new 'status' field
          if (task.completed !== undefined && !task.status) {
            task.status = task.completed ? 'Done' : 'Todo'
            delete task.completed
          }
          // Set defaults for new fields if missing
          return {
            ...task,
            status: task.status || 'Todo',
            assignee: task.assignee || '',
            dueDate: task.dueDate || '',
            priority: task.priority || 'Medium',
            createdAt: new Date(task.createdAt),
          }
        })
        setTasks(tasksWithDates)
      } catch (e) {
        console.error('Error loading tasks:', e)
      }
    }
  }, [])

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (tasks.length > 0 || localStorage.getItem('tasks')) {
      localStorage.setItem('tasks', JSON.stringify(tasks))
    }
  }, [tasks])

  const addTask = ({
    title,
    description,
    status,
    assignee,
    dueDate,
    priority,
  }: {
    title: string
    description: string
    status: TaskStatus
    assignee: string
    dueDate: string
    priority: TaskPriority
  }) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      description,
      status,
      assignee,
      dueDate,
      priority,
      createdAt: new Date(),
    }
    setTasks((prev) => [newTask, ...prev])
  }

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updates } : task))
    )
  }

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  const getTask = (id: string) => {
    return tasks.find((task) => task.id === id)
  }

  return (
    <TasksContext.Provider
      value={{ tasks, addTask, updateTask, deleteTask, getTask }}
    >
      {children}
    </TasksContext.Provider>
  )
}

export function useTasks() {
  const context = useContext(TasksContext)
  if (context === undefined) {
    throw new Error('useTasks must be used within a TasksProvider')
  }
  return context
}

