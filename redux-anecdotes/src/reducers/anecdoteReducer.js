import { createSlice } from "@reduxjs/toolkit"
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    update(state, action) {
      const id = action.payload.id
      const updatedAnecdote = action.payload.votedAnecdote
      state = state.map(anecdote =>
        anecdote.id !== id ? anecdote : updatedAnecdote)
      return state.sort((a, b) => b.votes - a.votes)
    },
    appendAnecdote(state, action) {
      const newAnecdote = action.payload
      state.push(newAnecdote)
      return state
    },
    setAnecdotes(state, action) {
      return action.payload.sort((a, b) => b.votes - a.votes)
    }
  }
})

export const { update, appendAnecdote, setAnecdotes } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const addAnecdote = (content) => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const voteAnecdote = (id) => {
  console.log(`voting anecdote with id ${id}`)
  return async (dispatch, getState) => {
    const state = getState()
    const anecdoteToVote = state.anecdotes.find(a => a.id === id)
    console.log('anecdoteToVote', anecdoteToVote)
    const votedAnecdote = { ...anecdoteToVote, votes: anecdoteToVote.votes + 1 }
    try {
      const updatedAnecdote = await anecdoteService.update(id, votedAnecdote)
      dispatch(update({ id, votedAnecdote: updatedAnecdote }))
    } catch (error) {
      console.error('Error updating anecdote:', error)
    }
  }
}


export default anecdoteSlice.reducer