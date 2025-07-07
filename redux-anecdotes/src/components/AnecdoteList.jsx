import { useSelector, useDispatch } from 'react-redux'
import { vote } from '../reducers/anecdoteReducer'
import { displayNotification } from './Notification'

const AnecdoteList = () => {
  const anecdotes = useSelector(({ filter, anecdotes}) => {
    return anecdotes.filter(a => a.content.toLowerCase().includes(filter.toLowerCase()))
  })
  const dispatch = useDispatch()

  const voteAnecdote = (id) => {
    dispatch(vote(id))
    displayNotification(`You voted '${anecdotes.find(a => a.id === id).content}'`)
  }

  return anecdotes.map(anecdote => (
    <div key={anecdote.id}>
      <div>
        {anecdote.content}
      </div>
      <div>
        has {anecdote.votes}
        <button onClick={() => voteAnecdote(anecdote.id)}>vote</button>
      </div>
    </div>
  ))
}

export default AnecdoteList