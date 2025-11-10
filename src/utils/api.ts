const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`)
  }

  return response.json()
}

// Helper functions for tasks
export const tasksApi = {
  getAll: async () => {
    return apiRequest<Array<{
      id: string
      title: string
      description: string
      status: string
      assignee: string
      dueDate: string
      priority: string
      todos: any[]
      createdAt: string
    }>>('/tasks')
  },
  getById: async (id: string) => {
    return apiRequest<{
      id: string
      title: string
      description: string
      status: string
      assignee: string
      dueDate: string
      priority: string
      todos: any[]
      createdAt: string
    }>(`/tasks/${id}`)
  },
  create: async (task: {
    title: string
    description: string
    status: string
    assignee: string
    dueDate: string
    priority: string
  }) => {
    return apiRequest<{
      id: string
      title: string
      description: string
      status: string
      assignee: string
      dueDate: string
      priority: string
      todos: any[]
      createdAt: string
    }>('/tasks', {
      method: 'POST',
      body: JSON.stringify({
        ...task,
        todos: [],
        createdAt: new Date().toISOString(),
      }),
    })
  },
  update: async (id: string, updates: {
    title?: string
    description?: string
    status?: string
    assignee?: string
    dueDate?: string
    priority?: string
  }) => {
    return apiRequest<{
      id: string
      title: string
      description: string
      status: string
      assignee: string
      dueDate: string
      priority: string
      todos: any[]
      createdAt: string
    }>(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    })
  },
  delete: async (id: string) => {
    return apiRequest<void>(`/tasks/${id}`, {
      method: 'DELETE',
    })
  },
}

// Helper functions for todos
export const todosApi = {
  getAll: async () => {
    return apiRequest<Array<{
      id: string
      taskId: string
      title: string
      description?: string
      status: string
      createdAt: string
    }>>('/todos')
  },
  create: async (todo: {
    taskId: string
    title: string
    description?: string
    status: string
  }) => {
    return apiRequest<{
      id: string
      taskId: string
      title: string
      description?: string
      status: string
      createdAt: string
    }>('/todos', {
      method: 'POST',
      body: JSON.stringify({
        ...todo,
        createdAt: new Date().toISOString(),
      }),
    })
  },
  update: async (id: string, updates: {
    title?: string
    description?: string
    status?: string
  }) => {
    return apiRequest<{
      id: string
      taskId: string
      title: string
      description?: string
      status: string
      createdAt: string
    }>(`/todos/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    })
  },
  delete: async (id: string) => {
    return apiRequest<void>(`/todos/${id}`, {
      method: 'DELETE',
    })
  },
}

