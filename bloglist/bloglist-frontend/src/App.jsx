import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Login from './components/Login'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)

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
    } catch (error) {
      console.error('Login failed:', error)
      alert('Invalid username or password')
    }
  }

  const logout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    blogService.setToken(null)
  }

  return (
    <>
      {!user ? (
        <Login onLogin={onLogin} />
      ) : (
        <div>
          <h2>blogs</h2>
          <p>{user.name} logged in <button onClick={logout}>logout</button></p>
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
          )}
        </div>
      )}
    </>
  )
}

export default App