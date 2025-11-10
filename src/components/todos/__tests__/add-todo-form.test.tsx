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

describe('AddTodoForm - Form Validation', () => {
  const mockOnAdd = jest.fn().mockResolvedValue(undefined)
  const mockOnCancel = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Required Field Validation', () => {
    it('should show error when title is empty on submit', async () => {
      const user = userEvent.setup()
      render(<AddTodoForm onAdd={mockOnAdd} onCancel={mockOnCancel} />, {
        wrapper: createWrapper(),
      })

      // Expand the form
      const expandButton = screen.getByRole('button', { name: /add todo/i })
      await user.click(expandButton)

      // Submit without entering title
      const submitButton = screen.getByRole('button', { name: /add/i })
      await user.click(submitButton)

      // Wait for validation error
      await waitFor(() => {
        expect(screen.getByText(/todo title is required/i)).toBeInTheDocument()
      })

      // Check aria-invalid is set
      const titleInput = screen.getByPlaceholderText(/todo title/i)
      expect(titleInput).toHaveAttribute('aria-invalid', 'true')
    })

    it('should validate title field on blur', async () => {
      const user = userEvent.setup()
      render(<AddTodoForm onAdd={mockOnAdd} onCancel={mockOnCancel} />, {
        wrapper: createWrapper(),
      })

      // Expand the form
      const expandButton = screen.getByRole('button', { name: /add todo/i })
      await user.click(expandButton)

      const titleInput = screen.getByPlaceholderText(/todo title/i)

      // Focus and blur without entering text
      await user.click(titleInput)
      await user.tab()

      // Wait for error to appear
      await waitFor(() => {
        expect(screen.getByText(/todo title is required/i)).toBeInTheDocument()
      })

      expect(titleInput).toHaveAttribute('aria-invalid', 'true')
    })

    it('should clear error when field becomes valid', async () => {
      const user = userEvent.setup()
      render(<AddTodoForm onAdd={mockOnAdd} onCancel={mockOnCancel} />, {
        wrapper: createWrapper(),
      })

      // Expand the form
      const expandButton = screen.getByRole('button', { name: /add todo/i })
      await user.click(expandButton)

      const titleInput = screen.getByPlaceholderText(/todo title/i)

      // Trigger error by blurring empty field
      await user.click(titleInput)
      await user.tab()

      await waitFor(() => {
        expect(screen.getByText(/todo title is required/i)).toBeInTheDocument()
      })

      // Now enter text and blur again
      await user.type(titleInput, 'Valid Todo Title')
      await user.tab()

      // Error should be cleared
      await waitFor(() => {
        expect(screen.queryByText(/todo title is required/i)).not.toBeInTheDocument()
      })

      expect(titleInput).toHaveAttribute('aria-invalid', 'false')
    })
  })

  describe('Form Submission', () => {
    it('should not submit form when validation fails', async () => {
      const user = userEvent.setup()
      render(<AddTodoForm onAdd={mockOnAdd} onCancel={mockOnCancel} />, {
        wrapper: createWrapper(),
      })

      // Expand the form
      const expandButton = screen.getByRole('button', { name: /add todo/i })
      await user.click(expandButton)

      // Try to submit without filling title
      const submitButton = screen.getByRole('button', { name: /add/i })
      await user.click(submitButton)

      // Wait for validation error
      await waitFor(() => {
        expect(screen.getByText(/todo title is required/i)).toBeInTheDocument()
      })

      // onAdd should not be called
      expect(mockOnAdd).not.toHaveBeenCalled()
    })

    it('should submit form when title is valid', async () => {
      const user = userEvent.setup()
      render(<AddTodoForm onAdd={mockOnAdd} onCancel={mockOnCancel} />, {
        wrapper: createWrapper(),
      })

      // Expand the form
      const expandButton = screen.getByRole('button', { name: /add todo/i })
      await user.click(expandButton)

      // Fill in title
      const titleInput = screen.getByPlaceholderText(/todo title/i)
      await user.type(titleInput, 'Test Todo')

      // Submit form
      const submitButton = screen.getByRole('button', { name: /add/i })
      await user.click(submitButton)

      // Wait for onAdd to be called
      await waitFor(() => {
        expect(mockOnAdd).toHaveBeenCalledWith('Test Todo', undefined)
      })
    })

    it('should submit form with description when provided', async () => {
      const user = userEvent.setup()
      render(<AddTodoForm onAdd={mockOnAdd} onCancel={mockOnCancel} />, {
        wrapper: createWrapper(),
      })

      // Expand the form
      const expandButton = screen.getByRole('button', { name: /add todo/i })
      await user.click(expandButton)

      // Fill in title and description
      const titleInput = screen.getByPlaceholderText(/todo title/i)
      await user.type(titleInput, 'Test Todo')

      const descriptionInput = screen.getByPlaceholderText(/description/i)
      await user.type(descriptionInput, 'Test Description')

      // Submit form
      const submitButton = screen.getByRole('button', { name: /add/i })
      await user.click(submitButton)

      // Wait for onAdd to be called with description
      await waitFor(() => {
        expect(mockOnAdd).toHaveBeenCalledWith('Test Todo', 'Test Description')
      })
    })

    it('should trim whitespace from title before submission', async () => {
      const user = userEvent.setup()
      render(<AddTodoForm onAdd={mockOnAdd} onCancel={mockOnCancel} />, {
        wrapper: createWrapper(),
      })

      // Expand the form
      const expandButton = screen.getByRole('button', { name: /add todo/i })
      await user.click(expandButton)

      // Fill in title with whitespace
      const titleInput = screen.getByPlaceholderText(/todo title/i)
      await user.type(titleInput, '  Test Todo  ')

      // Submit form
      const submitButton = screen.getByRole('button', { name: /add/i })
      await user.click(submitButton)

      // Wait for onAdd to be called with trimmed title
      await waitFor(() => {
        expect(mockOnAdd).toHaveBeenCalledWith('Test Todo', undefined)
      })
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA attributes for required fields', async () => {
      const user = userEvent.setup()
      render(<AddTodoForm onAdd={mockOnAdd} onCancel={mockOnCancel} />, {
        wrapper: createWrapper(),
      })

      // Expand the form
      const expandButton = screen.getByRole('button', { name: /add todo/i })
      await user.click(expandButton)

      const titleInput = screen.getByPlaceholderText(/todo title/i)
      expect(titleInput).toHaveAttribute('aria-required', 'true')
    })

    it('should link error messages to input fields via aria-describedby', async () => {
      const user = userEvent.setup()
      render(<AddTodoForm onAdd={mockOnAdd} onCancel={mockOnCancel} />, {
        wrapper: createWrapper(),
      })

      // Expand the form
      const expandButton = screen.getByRole('button', { name: /add todo/i })
      await user.click(expandButton)

      const titleInput = screen.getByPlaceholderText(/todo title/i)

      // Trigger validation error
      await user.click(titleInput)
      await user.tab()

      await waitFor(() => {
        const errorMessage = screen.getByText(/todo title is required/i)
        expect(errorMessage).toHaveAttribute('id', 'todo-title-error')
        expect(titleInput).toHaveAttribute('aria-describedby', 'todo-title-error')
      })
    })

    it('should have role="alert" on error messages', async () => {
      const user = userEvent.setup()
      render(<AddTodoForm onAdd={mockOnAdd} onCancel={mockOnCancel} />, {
        wrapper: createWrapper(),
      })

      // Expand the form
      const expandButton = screen.getByRole('button', { name: /add todo/i })
      await user.click(expandButton)

      // Trigger validation error
      const submitButton = screen.getByRole('button', { name: /add/i })
      await user.click(submitButton)

      await waitFor(() => {
        const errorMessage = screen.getByText(/todo title is required/i)
        expect(errorMessage).toHaveAttribute('role', 'alert')
      })
    })
  })

  describe('Loading State', () => {
    it('should disable inputs during submission', async () => {
      const user = userEvent.setup()
      // Create a promise that we can control
      let resolveAdd: () => void
      const addPromise = new Promise<void>((resolve) => {
        resolveAdd = resolve
      })
      const mockOnAddWithDelay = jest.fn().mockReturnValue(addPromise)

      render(<AddTodoForm onAdd={mockOnAddWithDelay} onCancel={mockOnCancel} />, {
        wrapper: createWrapper(),
      })

      // Expand the form
      const expandButton = screen.getByRole('button', { name: /add todo/i })
      await user.click(expandButton)

      // Fill in title
      const titleInput = screen.getByPlaceholderText(/todo title/i)
      await user.type(titleInput, 'Test Todo')

      // Submit form
      const submitButton = screen.getByRole('button', { name: /add/i })
      await user.click(submitButton)

      // Check that inputs are disabled during submission
      await waitFor(() => {
        expect(titleInput).toBeDisabled()
        expect(screen.getByPlaceholderText(/description/i)).toBeDisabled()
        expect(screen.getByRole('button', { name: /cancel/i })).toBeDisabled()
      })

      // Resolve the promise
      resolveAdd!()
      await waitFor(() => {
        expect(mockOnAddWithDelay).toHaveBeenCalled()
      })
    })

    it('should show loading state on submit button', async () => {
      const user = userEvent.setup()
      // Create a promise that we can control
      let resolveAdd: () => void
      const addPromise = new Promise<void>((resolve) => {
        resolveAdd = resolve
      })
      const mockOnAddWithDelay = jest.fn().mockReturnValue(addPromise)

      render(<AddTodoForm onAdd={mockOnAddWithDelay} onCancel={mockOnCancel} />, {
        wrapper: createWrapper(),
      })

      // Expand the form
      const expandButton = screen.getByRole('button', { name: /add todo/i })
      await user.click(expandButton)

      // Fill in title
      const titleInput = screen.getByPlaceholderText(/todo title/i)
      await user.type(titleInput, 'Test Todo')

      // Submit form
      const submitButton = screen.getByRole('button', { name: /add/i })
      await user.click(submitButton)

      // Check that button shows loading state
      await waitFor(() => {
        expect(screen.getByText(/adding/i)).toBeInTheDocument()
        expect(submitButton).toBeDisabled()
      })

      // Resolve the promise
      resolveAdd!()
    })
  })
})

