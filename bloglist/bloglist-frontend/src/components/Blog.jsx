import { useState } from 'react'

const Blog = ({ blog, onLike, showRemove, onRemove }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [view, setView] = useState(false)
  return (
    <>
      <div style={blogStyle}>
        {blog.title} {blog.author} <button onClick={() => setView(!view)}>{view ? 'hide' : 'show'}</button>
      </div>
      <div>
        {view && (
          <div>
            <p><a href={blog.url} target="_blank" rel="noreferrer">{blog.url}</a></p>
            <p>likes {blog.likes} <button onClick={onLike}>like</button></p>
            <p>{blog.user?.name}</p>
            {showRemove && (
              <button onClick={onRemove}>remove</button>
            )}
          </div>
        )}
      </div>
    </>
  )
}

export default Blog