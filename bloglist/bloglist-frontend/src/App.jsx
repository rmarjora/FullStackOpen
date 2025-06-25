import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Login from './components/Login'
import Create from './components/Create'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({ message: '', type: '' })

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
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

  const createBlog = async ({ title, author, url }) => {
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

  const displayNotification = (message, type, duration = 8000) => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification({ message: '', type: '' })
    }, duration)
  }
  return (
    <>
      <Notification message={notification.message} type={notification.type} />
      {!user ? (
        <Login onLogin={onLogin} />
      ) : (
        <div>
          <h2>blogs</h2>
          <p>{user.name} logged in <button onClick={logout}>logout</button></p>
          <Create onSubmit={createBlog}/>
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
          )}
        </div>
      )}
    </>
  )
}

export default App