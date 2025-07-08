import { addAnecdote } from '../reducers/anecdoteReducer'
import { useDispatch } from 'react-redux'
import { displayNotification } from './Notification'
import anecdoteService from '../services/anecdotes'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const createAnecdote = async (event) => {
    event.preventDefault()
    const newAnecdote = await anecdoteService.createNew(event.target.anecdote.value)
    console.log('newAnecdote', newAnecdote)
    dispatch(addAnecdote(newAnecdote))
    displayNotification(`You created '${newAnecdote.content}'`)
    event.target.anecdote.value = ''
  }

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={createAnecdote}>
        <div>
          <input name="anecdote" />
        </div>
        <button>create</button>
      </form>
    </>
  )
}

export default AnecdoteForm