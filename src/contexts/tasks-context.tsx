import React, { createContext, useContext } from 'react'
import { useTasksQuery, useCreateTask, useCreateTodo, useUpdateTask, useDeleteTask, useUpdateTodo, useDeleteTodo } from '@/hooks/use-tasks-query'
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
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  getTask: (id: string) => Task | undefined
  addTodo: (taskId: string, title: string, description?: string) => Promise<void>
  updateTodo: (taskId: string, todoId: string, updates: Partial<TodoItem>) => Promise<void>
  deleteTodo: (taskId: string, todoId: string) => Promise<void>
  moveTodo: (taskId: string, todoId: string, newStatus: TodoStatus) => Promise<void>
}

const TasksContext = createContext<TasksContextType | undefined>(undefined)

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient()
  const { data: tasks = [], isLoading } = useTasksQuery()
  const createTaskMutation = useCreateTask()
  const createTodoMutation = useCreateTodo()
  const updateTaskMutation = useUpdateTask()
  const deleteTaskMutation = useDeleteTask()
  const updateTodoMutation = useUpdateTodo()
  const deleteTodoMutation = useDeleteTodo()

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

  const updateTask = async (id: string, updates: Partial<Task>) => {
    await updateTaskMutation.mutateAsync({ id, updates })
  }

  const deleteTask = async (id: string) => {
    await deleteTaskMutation.mutateAsync(id)
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

  const updateTodo = async (taskId: string, todoId: string, updates: Partial<TodoItem>) => {
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
    
    // Update detail query as well
    queryClient.setQueryData<Task>(taskKeys.detail(taskId), (old) => {
      if (!old) return old
      return {
        ...old,
        todos: (old.todos || []).map((todo) =>
          todo.id === todoId ? { ...todo, ...updates } : todo
        ),
      }
    })

    // Call API to persist changes
    try {
      await updateTodoMutation.mutateAsync({
        id: todoId,
        updates: {
          title: updates.title,
          description: updates.description,
          status: updates.status,
        },
      })
    } catch (error) {
      // Revert optimistic update on error
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() })
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(taskId) })
      throw error
    }
  }

  const deleteTodo = async (taskId: string, todoId: string) => {
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

    // Update detail query as well
    queryClient.setQueryData<Task>(taskKeys.detail(taskId), (old) => {
      if (!old) return old
      return {
        ...old,
        todos: (old.todos || []).filter((todo) => todo.id !== todoId),
      }
    })

    // Call API to persist changes
    try {
      await deleteTodoMutation.mutateAsync(todoId)
    } catch (error) {
      // Revert optimistic update on error
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() })
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(taskId) })
      throw error
    }
  }

  const moveTodo = async (taskId: string, todoId: string, newStatus: TodoStatus) => {
    await updateTodo(taskId, todoId, { status: newStatus })
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

