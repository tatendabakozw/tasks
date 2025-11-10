import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AddTaskModal from '../add-task-modal'
import { TasksProvider } from '@/contexts/tasks-context'
import { ToastProvider } from '@/contexts/toast-context'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Mock the useModal hook
jest.mock('@/hooks/use-modal', () => ({
  useModal: () => ({
    modalRef: { current: null },
  }),
}))

// Mock SelectMenu component
jest.mock('@/components/menus/select-menu', () => {
  return function MockSelectMenu({ value, onChange, options, placeholder }: any) {
    return (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        data-testid={`select-${placeholder?.toLowerCase().replace(/\s+/g, '-')}`}
      >
        <option value=''>{placeholder}</option>
        {options.map((opt: any) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    )
  }
})

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <TasksProvider>{children}</TasksProvider>
      </ToastProvider>
    </QueryClientProvider>
  )
}

describe('AddTaskModal', () => {
  const mockOnClose = jest.fn()
  const mockOnAdd = jest.fn().mockResolvedValue(undefined)

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should add a task when form is submitted with valid data', async () => {
    const user = userEvent.setup()
    
    render(
      <AddTaskModal isOpen={true} onClose={mockOnClose} onAdd={mockOnAdd} />,
      { wrapper: createWrapper() }
    )

    // Fill in the form
    const titleInput = screen.getByLabelText(/task title/i)
    await user.type(titleInput, 'Test Task')

    const statusSelect = screen.getByTestId('select-select-status...')
    await user.selectOptions(statusSelect, 'Todo')

    const prioritySelect = screen.getByTestId('select-select-priority...')
    await user.selectOptions(prioritySelect, 'Medium')

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /add task/i })
    await user.click(submitButton)

    // Verify onAdd was called with correct data
    await waitFor(() => {
      expect(mockOnAdd).toHaveBeenCalledWith({
        title: 'Test Task',
        description: '',
        status: 'Todo',
        assignee: '',
        dueDate: expect.any(String),
        priority: 'Medium',
      })
    })
  })
})

