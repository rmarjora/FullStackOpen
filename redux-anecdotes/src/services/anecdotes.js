import axios from 'axios';

const baseUrl = 'http://localhost:3001'

const getAll = async () => {
  const response = await axios.get(`${baseUrl}/anecdotes`);
  return response.data;
}

const createNew = async (content) => {
  const object = { content, votes: 0 };
  console.log('Creating new anecdote:', object);
  const response = await axios.post(`${baseUrl}/anecdotes`, object);
  return response.data;
}

const update = async (id, anecdote) => {
  const response = await axios.put(`${baseUrl}/anecdotes/${id}`, anecdote);
  return response.data;
}

export default {
    getAll,
    createNew,
    update
}