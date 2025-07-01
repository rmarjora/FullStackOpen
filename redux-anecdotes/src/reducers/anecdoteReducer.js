const anecdotesAtStart = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}

const initialState = anecdotesAtStart.map(asObject)

const reducer = (state = initialState, action) => {
  console.log('state now: ', state)
  console.log('action', action)

  const sortByVotes = anecdotes => 
    anecdotes.slice().sort((a, b) => b.votes - a.votes)

  switch(action.type) {
    case 'VOTE': {
      const id = action.payload.id
      const anecdoteToVote = state.find(a => a.id === id)
      const votedAnecdote = { ...anecdoteToVote, votes: anecdoteToVote.votes + 1 }
      const updatedState = state.map(anecdote =>
        anecdote.id !== id ? anecdote : votedAnecdote
      )
      return sortByVotes(updatedState)
    }
    case 'ADD_ANECDOTE': {
      const updatedState = [...state, action.payload]
      return sortByVotes(updatedState)
    }
    default:
      return sortByVotes(state)
  }
}

const vote = (id) => {
    console.log('vote', id)
    return {
      type: 'VOTE',
      payload: { id }
    }
  }

  const createAnecdote = (content) => {
    const anecdote = {
      content: content,
      id: (100000 * Math.random()).toFixed(0),
      votes: 0
    }

    return {
      type: 'ADD_ANECDOTE',
      payload: anecdote
    }
  }

export default reducer

export { vote, createAnecdote }