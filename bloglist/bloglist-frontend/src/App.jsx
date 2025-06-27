import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Login from './components/Login'
import Create from './components/Create'
import Togglable from './components/Togglable'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({ message: '', type: 'error' })

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedBlogappUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedBlogappUserJSON) {
      const user = JSON.parse(loggedBlogappUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  })

  const onLogin = async (credentials) => {
    try {
      const user = await loginService.login(credentials)
      setUser(user)
      blogService.setToken(user.token)
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      displayNotification(`welcome ${user.name}`, 'success')
    } catch (error) {
      console.error('Login failed:', error)
      displayNotification('wrong username or password', 'error')
    }
  }

  const logout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    blogService.setToken(null)
  }

  const blogFormRef = useRef()

  const createBlog = async ({ title, author, url }) => {
    blogFormRef.current.toggleVisibility()
    try {
      const newBlog = await blogService.create({ title, author, url })
      setBlogs(blogs.concat(newBlog))
      displayNotification(`A new blog ${newBlog.title} by ${newBlog.author} added`, 'success')
    } catch (error) {
      console.error('Blog creation failed:', error)
      displayNotification('failed to create blog', 'error')
      return
    }
  }

  const likeBlog = async (id) => {
    const blogToLike = blogs.find(blog => blog.id === id)
    const updatedBlog = { ...blogToLike, likes: blogToLike.likes + 1, user: blogToLike.user?.id }

    try {
      const returnedBlog = await blogService.update(id, updatedBlog)
      setBlogs(blogs.map(blog => blog.id !== id ? blog : returnedBlog))
      displayNotification(`You liked ${returnedBlog.title}`, 'success')
    } catch (error) {
      console.error('Failed to like the blog:', error)
      displayNotification('failed to like the blog', 'error')
    }
  }

  const removeBlog = async (id) => {
    const blogToRemove = blogs.find(blog => blog.id === id)
    if (!window.confirm(`Remove blog ${blogToRemove.title} by ${blogToRemove.author}?`)) {
      return
    }

    try {
      await blogService.deleteBlog(id)
      setBlogs(blogs.filter(blog => blog.id !== id))
      displayNotification(`Blog ${blogToRemove.title} removed`, 'success')
    } catch (error) {
      console.error('Failed to remove the blog:', error)
      displayNotification('failed to remove the blog', 'error')
    }
  }

  const displayNotification = (message, type, duration = 8000) => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification({ message: '', type: '' })
    }, duration)
  }

  blogs.sort((a, b) => b.likes - a.likes)

  return (
    <>
      <Notification message={notification.message} type={notification.type} />
      {!user ? (
        <Login onLogin={onLogin} />
      ) : (
        <div>
          <h2>blogs</h2>
          <p>{user.name} logged in <button onClick={logout}>logout</button></p>
          <Togglable buttonLabel="new blog" ref={blogFormRef}>
            <Create onSubmit={createBlog} />
          </Togglable>
          {blogs.map(blog =>
            <Blog
              key={blog.id}
              blog={blog}
              onLike={() => likeBlog(blog.id)}
              showRemove={blog.user?.username === user.username}
              onRemove={() => removeBlog(blog.id)}
            />
          )}
        </div>
      )}
    </>
  )
}

export default App