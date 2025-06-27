const { expect } = require('@playwright/test')

const login = async (page, username, password) => {
  await page.getByTestId('username').fill(username);
  await page.getByTestId('password').fill(password);
  await page.getByRole('button', { name: 'login' }).click();
}

const createBlog = async (page, title, author, url) => {
  const blogCount = await page.evaluate(() => {
    const blogList = document.querySelectorAll('.blog');
    return blogList.length;
  });
  await page.getByRole('button', { name: 'new blog' }).click();
  await page.locator('.titleInput').fill(title);
  await page.locator('.authorInput').fill(author);
  await page.locator('.urlInput').fill(url);
  await page.getByRole('button', { name: 'create' }).click();
  await page.waitForFunction(
    (initialCount) => {
      const blogList = document.querySelectorAll('.blog');
      return blogList.length === initialCount + 1;
    },
    blogCount
  );
}

const likeBlog = async (mostLikedBlog, likeCount = 1) => {
  const showButton = mostLikedBlog.getByRole('button', { name: 'show' })
  if (await showButton.isVisible()) {
    await showButton.click()
  }

  for (let i = 0; i < 5; i++) {
    await mostLikedBlog.getByRole('button', { name: 'like' }).click()
    await expect(mostLikedBlog.getByTestId('blogLikes')).toContainText(`${i + 1}`)
  }
}

module.exports = {
  login,
  createBlog,
  likeBlog
};