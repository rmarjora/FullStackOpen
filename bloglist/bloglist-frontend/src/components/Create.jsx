import { useState } from 'react'

const Create = ({ onSubmit }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={(e) => {
        e.preventDefault()
        onSubmit({ title, author, url })
      }}>
        <div>
          <label htmlFor="">title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="">author</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="">url</label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default Create