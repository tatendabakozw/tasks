import { Task, TodoItem } from '@/contexts/tasks-context'

export function calculateTaskProgress(task: Task): {
  percentage: number
  completed: number
  total: number
} {
  const todos = task.todos || []
  const total = todos.length
  const completed = todos.filter((todo) => todo.status === 'Complete').length

  if (total === 0) {
    return { percentage: 0, completed: 0, total: 0 }
  }

  const percentage = Math.round((completed / total) * 100)
  return { percentage, completed, total }
}

export function getSuggestedTaskStatus(task: Task): 'Todo' | 'Doing' | 'Done' {
  const todos = task.todos || []
  
  if (todos.length === 0) {
    return task.status // Keep current status if no todos
  }

  const completed = todos.filter((todo) => todo.status === 'Complete').length
  const inProgress = todos.filter((todo) => todo.status === 'In Progress').length
  const total = todos.length

  // If all todos are complete, suggest "Done"
  if (completed === total && total > 0) {
    return 'Done'
  }

  // If any todos are in progress or complete, suggest "Doing"
  if (inProgress > 0 || completed > 0) {
    return 'Doing'
  }

  // Otherwise, suggest "Todo"
  return 'Todo'
}

