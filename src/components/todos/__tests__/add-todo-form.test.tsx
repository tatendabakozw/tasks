import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AddTodoForm from '../add-todo-form'
import { ToastProvider } from '@/contexts/toast-context'

const createWrapper = () => {
  return ({ children }: { children: React.ReactNode }) => (
    <ToastProvider>{children}</ToastProvider>
  )
}

describe('AddTodoForm', () => {
  const mockOnAdd = jest.fn().mockResolvedValue(undefined)
  const mockOnCancel = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should add a todo when form is submitted with valid title', async () => {
    const user = userEvent.setup()
    
    render(<AddTodoForm onAdd={mockOnAdd} onCancel={mockOnCancel} />, {
      wrapper: createWrapper(),
    })

    // Expand the form
    const expandButton = screen.getByRole('button', { name: /add todo/i })
    await user.click(expandButton)

    // Fill in the todo title
    const titleInput = screen.getByPlaceholderText(/todo title/i)
    await user.type(titleInput, 'Test Todo')

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /add/i })
    await user.click(submitButton)

    // Verify onAdd was called with correct data
    await waitFor(() => {
      expect(mockOnAdd).toHaveBeenCalledWith('Test Todo', undefined)
    })
  })
})
