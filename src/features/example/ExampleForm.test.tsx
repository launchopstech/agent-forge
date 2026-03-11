import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ExampleForm } from './ExampleForm'

async function fillForm(values: { name: string; email: string; message: string }) {
  await userEvent.type(screen.getByLabelText(/name/i), values.name)
  await userEvent.type(screen.getByLabelText(/email/i), values.email)
  await userEvent.type(screen.getByLabelText(/message/i), values.message)
}

describe('ExampleForm', () => {
  it('shows validation errors when submitted empty', async () => {
    render(<ExampleForm />)
    await userEvent.click(screen.getByRole('button', { name: /send message/i }))

    await waitFor(() => {
      expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument()
      expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument()
      expect(screen.getByText(/message must be at least 10 characters/i)).toBeInTheDocument()
    })
  })

  it('calls onSubmit with valid data', async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined)
    render(<ExampleForm onSubmit={handleSubmit} />)

    await fillForm({
      name: 'Jane Doe',
      email: 'jane@example.com',
      message: 'This is a test message that is long enough',
    })
    await userEvent.click(screen.getByRole('button', { name: /send message/i }))

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        name: 'Jane Doe',
        email: 'jane@example.com',
        message: 'This is a test message that is long enough',
      })
    })
  })

  it('shows success state after submission', async () => {
    render(<ExampleForm onSubmit={vi.fn().mockResolvedValue(undefined)} />)

    await fillForm({
      name: 'Jane Doe',
      email: 'jane@example.com',
      message: 'This is a test message that is long enough',
    })
    await userEvent.click(screen.getByRole('button', { name: /send message/i }))

    await waitFor(() => {
      expect(screen.getByRole('status')).toBeInTheDocument()
      expect(screen.getByText(/message sent/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /send another/i })).toBeInTheDocument()
    })
  })
})
