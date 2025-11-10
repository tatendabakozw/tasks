import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { tasksApi, todosApi } from '@/utils/api'
import { Task, TaskStatus, TaskPriority, TodoItem, TodoStatus } from '@/contexts/tasks-context'

// Transform API task data to Task type
const transformTask = (task: any, todos: any[]): Task => {
  const taskTodos = todos
    .filter((todo) => todo.taskId === task.id)
    .map((todo) => ({
      id: todo.id,
      taskId: todo.taskId,
      title: todo.title,
      description: todo.description,
      status: todo.status as TodoStatus,
      createdAt: new Date(todo.createdAt),
    }))

  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status as TaskStatus,
    assignee: task.assignee || '',
    dueDate: task.dueDate || '',
    priority: task.priority as TaskPriority,
    todos: taskTodos,
    createdAt: new Date(task.createdAt),
  }
}

// Query key factory
export const taskKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskKeys.all, 'list'] as const,
  list: (filters: string) => [...taskKeys.lists(), { filters }] as const,
  details: () => [...taskKeys.all, 'detail'] as const,
  detail: (id: string) => [...taskKeys.details(), id] as const,
}

export const todoKeys = {
  all: ['todos'] as const,
  lists: () => [...todoKeys.all, 'list'] as const,
  list: (taskId: string) => [...todoKeys.lists(), taskId] as const,
}

// Hook to fetch all tasks
export function useTasksQuery() {
  return useQuery({
    queryKey: taskKeys.lists(),
    queryFn: async () => {
      // Add 2 second delay to show skeleton loaders
      await new Promise((resolve) => setTimeout(resolve, 2000))
      
      const [tasksData, todosData] = await Promise.all([
        tasksApi.getAll(),
        todosApi.getAll(),
      ])

      return tasksData.map((task: any) => transformTask(task, todosData))
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

// Hook to create a task
export function useCreateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (task: {
      title: string
      description: string
      status: TaskStatus
      assignee: string
      dueDate: string
      priority: TaskPriority
    }) => {
      return tasksApi.create({
        title: task.title,
        description: task.description,
        status: task.status,
        assignee: task.assignee,
        dueDate: task.dueDate,
        priority: task.priority,
      })
    },
    onSuccess: () => {
      // Invalidate and refetch tasks
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() })
    },
  })
}

// Hook to fetch a single task
export function useTaskQuery(id: string | undefined) {
  return useQuery({
    queryKey: taskKeys.detail(id || ''),
    queryFn: async () => {
      if (!id) throw new Error('Task ID is required')
      
      // Add 2 second delay to show skeleton loaders
      await new Promise((resolve) => setTimeout(resolve, 2000))
      
      const [taskData, todosData] = await Promise.all([
        tasksApi.getById(id),
        todosApi.getAll(),
      ])

      return transformTask(taskData, todosData)
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

// Hook to update a task
export function useUpdateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Task> }) => {
      return tasksApi.update(id, {
        title: updates.title,
        description: updates.description,
        status: updates.status,
        assignee: updates.assignee,
        dueDate: updates.dueDate,
        priority: updates.priority,
      })
    },
    onSuccess: (data, variables) => {
      // Invalidate both list and detail queries
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() })
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(variables.id) })
    },
  })
}

// Hook to delete a task
export function useDeleteTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      return tasksApi.delete(id)
    },
    onSuccess: (_, id) => {
      // Invalidate list and remove detail from cache
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() })
      queryClient.removeQueries({ queryKey: taskKeys.detail(id) })
    },
  })
}

// Hook to create a todo
export function useCreateTodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (todo: {
      taskId: string
      title: string
      description?: string
    }) => {
      return todosApi.create({
        taskId: todo.taskId,
        title: todo.title,
        description: todo.description,
        status: 'Pending',
      })
    },
    onSuccess: (_, variables) => {
      // Invalidate tasks to refetch with new todos
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() })
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(variables.taskId) })
    },
  })
}

  // Hook to update a todo
export function useUpdateTodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: { title?: string; description?: string; status?: string } }) => {
      return todosApi.update(id, updates)
    },
    onSuccess: (_, variables) => {
      // Invalidate tasks to refetch with updated todos
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() })
      // We need to invalidate all detail queries since we don't know which task this todo belongs to
      queryClient.invalidateQueries({ queryKey: taskKeys.details() })
    },
  })
}

// Hook to delete a todo
export function useDeleteTodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      return todosApi.delete(id)
    },
    onSuccess: () => {
      // Invalidate tasks to refetch with updated todos
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() })
      queryClient.invalidateQueries({ queryKey: taskKeys.details() })
    },
  })
}

