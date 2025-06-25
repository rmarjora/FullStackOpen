import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import Create from './Create'

test('Create component calls onSubmit with correct data', async () => {
  const mockOnSubmit = vi.fn()
  const { container } = render(<Create onSubmit={mockOnSubmit} />)

  const titleInput = container.querySelector('.titleInput')
  const authorInput = container.querySelector('.authorInput')
  const urlInput = container.querySelector('.urlInput')
  const submitButton = container.querySelector('button')

  await userEvent.type(titleInput, 'Test Title')
  await userEvent.type(authorInput, 'Test Author')
  await userEvent.type(urlInput, 'http://test.com')
  await userEvent.click(submitButton)

  expect(mockOnSubmit).toHaveBeenCalledWith({
    title: 'Test Title',
    author: 'Test Author',
    url: 'http://test.com'
  })
  expect(mockOnSubmit).toHaveBeenCalledTimes(1)
})