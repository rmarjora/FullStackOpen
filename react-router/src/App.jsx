import {
  BrowserRouter as Router,
  Routes, Route, Link, Navigate,
  useParams, useNavigate, useMatch
} from 'react-router-dom'
import { useState }  from 'react'
import ReactDOM from 'react-dom/client'
import Notes from './components/Notes.jsx'

const Home = () => (
  <div> <h2>TKTL notes app</h2> </div>
)

const Users = () => (
  <div> <h2>Users</h2> </div>
)

const Login = (props) => {
  const navigate = useNavigate()

  const onSubmit = (event) => {
    event.preventDefault()
    props.onLogin('mluukkai')
    navigate('/')
  }

  return (
    <div>
      <h2>login</h2>
      <form onSubmit={onSubmit}>
        <div>
          username: <input />
        </div>
        <div>
          password: <input type='password' />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

const Note = ({ note }) => {
  return (
    <div>
      <h2>{note.content}</h2>
      <div>{note.user}</div>
      <div><strong>{note.important ? 'important' : ''}</strong></div>
    </div>
  )
}

const App = () => {
  const [notes, setNotes] = useState([
    { id: 1, content: 'HTML is easy', important: true},
    { id: 2, content: 'Browser can execute only JavaScript', important: false },
    { id: 3, content: 'GET and POST are the most important methods of HTTP protocol', important: true }
  ])

  const [user, setUser] = useState(null)
  const padding = {
    padding: 5
  }

  const match = useMatch('/notes/:id')
  const note = match
    ? notes.find(note => note.id === Number(match.params.id))
    : null

  console.log('match', match)
    console.log('note', note)

  return (
    <>
      <div>
        <Link style={padding} to="/">home</Link>
        <Link style={padding} to="/notes">notes</Link>
        <Link style={padding} to="/users">users</Link>
        {user
          ? <em>{user} logged in</em>
          : <Link style={padding} to="/login">login</Link>}
      </div>

      <Routes>
        <Route path="/notes/:id" element = {<Note note={note}/>}/>
        <Route path="/notes" element={<Notes notes={notes}/>} />
        <Route path="/users" element={user ? <Users /> : <Navigate replace to="/login" />} />
        <Route path="/" element={<Home />} />
      </Routes>

      <div>
        <i>Note app, Department of Computer Science 2024</i>
      </div>
    </>
  )
}

export default App