const { test, expect, beforeEach, describe } = require('@playwright/test')
const { login, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    // Reset the database before each test
    await request.post('/api/testing/reset')
    // Create a test user
    await request.post('/api/users', {
      data: {
        username: 'testuser',
        name: 'Test User',
        password: 'sekret'
      }
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    const loginHeader = page.getByRole('heading', { name: 'login to application' })
    await expect(loginHeader).toBeVisible()

    const usernameInput = page.getByTestId('username')
    await expect(usernameInput).toBeVisible()

    const passwordInput = page.getByTestId('password')
    await expect(passwordInput).toBeVisible()

    const loginButton = page.getByRole('button', { name: 'login' })
    await expect(loginButton).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await login(page, 'testuser', 'sekret')
      const userInfo = page.getByText('Test User logged in')
      await expect(userInfo).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await login(page, 'testuser', 'wrongpassword')
      const errorMessage = page.getByText('wrong username or password')
      await expect(errorMessage).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await login(page, 'testuser', 'sekret')
    })

    test('A blog can be created', async ({ page }) => {
      await createBlog(page, 'Playwright Blog', 'Playwright Author', 'https://example.com')

      const newBlog = page.getByText('Playwright Blog Playwright Author')
      await expect(newBlog).toBeVisible()
    })

    describe('When there are blogs', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'First Blog', 'Author One', 'https://example.com/1')
        await createBlog(page, 'Second Blog', 'Author Two', 'https://example.com/2')
      })

      test('A blog can be liked', async ({ page }) => {
        // Find the blog with the title "First Blog" and click its "show" button
        const blog = page.locator('.blog', { hasText: 'First Blog' })
        await blog.getByRole('button', { name: 'show' }).click()

        // Click the like button
        await blog.getByRole('button', { name: 'like' }).click()

        // Wait for the like count to update
        await expect(blog).toContainText('likes 1')
      })

      test('A blog can be removed by the creator', async ({ page }) => {
        // Find the blog with the title "First Blog" and click its "show" button
        const blog = page.locator('.blog', { hasText: 'First Blog' })
        await blog.getByRole('button', { name: 'show' }).click()

        // click window.confirm to accept the removal
        await page.on('dialog', async dialog => {
          await dialog.accept()
        })

        // Click the remove button
        await blog.getByRole('button', { name: 'remove' }).click()

        // Check that the blog is no longer visible
        await expect(blog).toBeVisible(false)
      })

      test('Only the creator can remove a blog', async ({ page, request }) => {
        // Create a second user
        await request.post('/api/users', {
          data: {
            username: 'anotheruser',
            name: 'Another User',
            password: '123456'
          }
        })

        // Log in as the second user
        await page.getByRole('button', { name: 'logout' }).click()
        await login(page, 'anotheruser', '123456')

        // Find the blog with the title "First Blog" and click its "show" button
        const blog = page.locator('.blog', { hasText: 'First Blog' })
        await blog.getByRole('button', { name: 'show' }).click()

        // Ensure the remove button is not visible
        await blog.getByRole('button', { name: 'remove' }).isVisible(false)
      })

      test.only('Blogs are ordered by likes', async ({ page }) => {
        await createBlog(page, 'Most Liked Blog', 'Popular Author', 'https://example.com/most-liked')

        // Like it 5 times
        const mostLikedBlog = page.locator('.blog', { hasText: 'Most Liked Blog' })
        await mostLikedBlog.getByRole('button', { name: 'show' }).click()
        // Like the blog multiple times using a helper function
        async function likeBlog(blogLocator, likeCount) {
          for (let i = 0; i < likeCount; i++) {
            await blogLocator.getByRole('button', { name: 'like' }).click()
            await expect(blogLocator.getByTestId('blogLikes')).toContainText(`${i + 1}`)
          }
        }

        await likeBlog(mostLikedBlog, 5)

        // Ensure all blogs are expanded to reveal likes
        const allBlogs = page.locator('.blog')
        const blogCount = await allBlogs.count()
        for (let i = 0; i < blogCount; i++) {
          const blog = allBlogs.nth(i)
          const showButton = blog.getByRole('button', { name: 'show' })
          if (await showButton.isVisible()) {
            await showButton.click()
          }
        }

        // Get all like counts
        const likeCounts = []
        for (let i = 0; i < blogCount; i++) {
          const blog = allBlogs.nth(i)
          const likeText = await blog.getByTestId('blogLikes').textContent()
          const likes = parseInt(likeText, 10)
          likeCounts.push(likes)
        }

        console.log('Like counts:', likeCounts)

        // Check if likes are in descending order
        const sorted = [...likeCounts].sort((a, b) => b - a)
        expect(likeCounts).toEqual(sorted)
      })
    })
  })
})