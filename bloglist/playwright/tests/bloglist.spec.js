const { test, expect, beforeEach, describe } = require('@playwright/test')
const { login } = require('./helper')

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
})