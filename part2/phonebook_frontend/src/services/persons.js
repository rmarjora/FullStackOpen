import axios from 'axios'
const baseUrl = process.env.REACT_APP_API_URL 
  ? `${process.env.REACT_APP_API_URL}/api/persons` 
  : "http://localhost:3001/api/persons";

const getAll = () => {
  console.log(`Fetching all persons from ${baseUrl}`)
  console.log(`environment variable REACT_APP_API_URL: ${process.env.REACT_APP_API_URL}`)
  console.log(`environment variable PORT: ${process.env.PORT}`)
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = newObject => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

const deleteItem = id => {
  const request = axios.delete(`${baseUrl}/${id}`)
  return request.then(response => response.data)
}

export default { getAll, create, update, deleteItem }