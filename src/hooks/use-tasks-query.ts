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
    onSuccess: () => {
      // Invalidate tasks to refetch with new todos
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() })
    },
  })
}

