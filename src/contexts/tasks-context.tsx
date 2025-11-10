import React, { createContext, useContext, useState, useEffect } from 'react'
import { todosApi, tasksApi } from '@/utils/api'

export type TaskStatus = 'Todo' | 'Doing' | 'Done'
export type TaskPriority = 'Low' | 'Medium' | 'High'
export type TodoStatus = 'Pending' | 'Todo' | 'In Progress' | 'Complete'

export interface TodoItem {
  id: string
  taskId?: string // Optional for backward compatibility, but required for JSON Server
  title: string
  description?: string
  status: TodoStatus
  createdAt: Date | string // Can be Date or ISO string from API
}

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  assignee: string
  dueDate: string // ISO date string
  priority: TaskPriority
  todos: TodoItem[]
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
  }) => Promise<void>
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  getTask: (id: string) => Task | undefined
  addTodo: (taskId: string, title: string, description?: string) => Promise<void>
  updateTodo: (taskId: string, todoId: string, updates: Partial<TodoItem>) => void
  deleteTodo: (taskId: string, todoId: string) => void
  moveTodo: (taskId: string, todoId: string, newStatus: TodoStatus) => void
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
            todos: task.todos
              ? task.todos.map((todo: any) => ({
                  ...todo,
                  createdAt: new Date(todo.createdAt),
                }))
              : [],
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

  const addTask = async ({
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
    try {
      // Create task in JSON Server
      const newTask = await tasksApi.create({
        title,
        description,
        status,
        assignee,
        dueDate,
        priority,
      })

      // Update local state with the task from server
      const taskItem: Task = {
        id: newTask.id,
        title: newTask.title,
        description: newTask.description,
        status: newTask.status as TaskStatus,
        assignee: newTask.assignee,
        dueDate: newTask.dueDate,
        priority: newTask.priority as TaskPriority,
        todos: newTask.todos
          ? newTask.todos.map((todo: any) => ({
              id: todo.id,
              taskId: todo.taskId,
              title: todo.title,
              description: todo.description,
              status: todo.status as TodoStatus,
              createdAt: new Date(todo.createdAt),
            }))
          : [],
        createdAt: new Date(newTask.createdAt),
      }

      setTasks((prev) => [taskItem, ...prev])
    } catch (error) {
      console.error('Error adding task:', error)
      // Re-throw so caller can handle it (show toast, etc.)
      throw error
    }
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

  const addTodo = async (taskId: string, title: string, description?: string) => {
    try {
      // Create todo in JSON Server
      const newTodo = await todosApi.create({
        taskId,
        title,
        description,
        status: 'Pending',
      })

      // Update local state with the todo from server
      const todoItem: TodoItem = {
        id: newTodo.id,
        taskId: newTodo.taskId,
        title: newTodo.title,
        description: newTodo.description,
        status: newTodo.status as TodoStatus,
        createdAt: new Date(newTodo.createdAt),
      }

      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? { ...task, todos: [...(task.todos || []), todoItem] }
            : task
        )
      )
    } catch (error) {
      console.error('Error adding todo:', error)
      // Re-throw so caller can handle it (show toast, etc.)
      throw error
    }
  }

  const updateTodo = (taskId: string, todoId: string, updates: Partial<TodoItem>) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              todos: (task.todos || []).map((todo) =>
                todo.id === todoId ? { ...todo, ...updates } : todo
              ),
            }
          : task
      )
    )
  }

  const deleteTodo = (taskId: string, todoId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              todos: (task.todos || []).filter((todo) => todo.id !== todoId),
            }
          : task
      )
    )
  }

  const moveTodo = (taskId: string, todoId: string, newStatus: TodoStatus) => {
    updateTodo(taskId, todoId, { status: newStatus })
  }

  return (
    <TasksContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        deleteTask,
        getTask,
        addTodo,
        updateTodo,
        deleteTodo,
        moveTodo,
      }}
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

