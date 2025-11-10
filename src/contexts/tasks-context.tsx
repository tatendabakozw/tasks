import React, { createContext, useContext } from 'react'
import { useTasksQuery, useCreateTask, useCreateTodo } from '@/hooks/use-tasks-query'
import { todosApi, tasksApi } from '@/utils/api'
import { useQueryClient } from '@tanstack/react-query'
import { taskKeys } from '@/hooks/use-tasks-query'

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
  isLoading: boolean
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
  const queryClient = useQueryClient()
  const { data: tasks = [], isLoading } = useTasksQuery()
  const createTaskMutation = useCreateTask()
  const createTodoMutation = useCreateTodo()

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
    await createTaskMutation.mutateAsync({
      title,
      description,
      status,
      assignee,
      dueDate,
      priority,
    })
  }

  const updateTask = (id: string, updates: Partial<Task>) => {
    // Optimistic update with React Query
    queryClient.setQueryData<Task[]>(taskKeys.lists(), (old) => {
      if (!old) return old
      return old.map((task) => (task.id === id ? { ...task, ...updates } : task))
    })
    // TODO: Add API call for update when implemented
  }

  const deleteTask = (id: string) => {
    // Optimistic update with React Query
    queryClient.setQueryData<Task[]>(taskKeys.lists(), (old) => {
      if (!old) return old
      return old.filter((task) => task.id !== id)
    })
    // TODO: Add API call for delete when implemented
  }

  const getTask = (id: string) => {
    return tasks.find((task) => task.id === id)
  }

  const addTodo = async (taskId: string, title: string, description?: string) => {
    await createTodoMutation.mutateAsync({
      taskId,
      title,
      description,
    })
  }

  const updateTodo = (taskId: string, todoId: string, updates: Partial<TodoItem>) => {
    // Optimistic update with React Query
    queryClient.setQueryData<Task[]>(taskKeys.lists(), (old) => {
      if (!old) return old
      return old.map((task) =>
        task.id === taskId
          ? {
              ...task,
              todos: (task.todos || []).map((todo) =>
                todo.id === todoId ? { ...todo, ...updates } : todo
              ),
            }
          : task
      )
    })
    // TODO: Add API call for update when implemented
  }

  const deleteTodo = (taskId: string, todoId: string) => {
    // Optimistic update with React Query
    queryClient.setQueryData<Task[]>(taskKeys.lists(), (old) => {
      if (!old) return old
      return old.map((task) =>
        task.id === taskId
          ? {
              ...task,
              todos: (task.todos || []).filter((todo) => todo.id !== todoId),
            }
          : task
      )
    })
    // TODO: Add API call for delete when implemented
  }

  const moveTodo = (taskId: string, todoId: string, newStatus: TodoStatus) => {
    updateTodo(taskId, todoId, { status: newStatus })
  }

  return (
    <TasksContext.Provider
      value={{
        tasks,
        isLoading,
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

