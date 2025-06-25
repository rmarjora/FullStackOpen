import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect } from 'vitest'
import Blog from './Blog'

test('Blog\'s title and author are displayed', () => {
  const blog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'http://test.com',
    likes: 0
  }

  const { container } = render(
    <Blog
      blog={blog}
      onLike={() => {}}
      showRemove={false}
      onRemove={() => {}}
    />
  )

  expect(container).toHaveTextContent('Test Blog')
  expect(container).toHaveTextContent('Test Author')
  expect(container).not.toHaveTextContent('http://test.com')
  expect(container).not.toHaveTextContent('likes')
})

test('Blog\'s url and likes are displayed when the button is clicked', async () => {
  const blog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'http://test.com',
    likes: 0
  }

  const { container } = render(
    <Blog
      blog={blog}
      onLike={() => {}}
      showRemove={false}
      onRemove={() => {}}
    />
  )

  const button = container.querySelector('button')
  await userEvent.click(button)
  expect(container).toHaveTextContent('http://test.com')
  expect(container).toHaveTextContent('likes 0')
})

test('Clicking the like button twice calls the like handler twice', async () => {
  const blog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'http://test.com',
    likes: 0
  }

  const mockLikeHandler = vi.fn()

  const { container } = render(
    <Blog
      blog={blog}
      onLike={mockLikeHandler}
      showRemove={false}
      onRemove={() => {}}
    />
  )

  // Open the blog details
  const showButton = container.querySelector('button')
  await userEvent.click(showButton)

  // Click the like button twice
  const likeButton = container.querySelector('.likeButton')
  await userEvent.click(likeButton)
  await userEvent.click(likeButton)
  expect(mockLikeHandler).toHaveBeenCalledTimes(2)
})