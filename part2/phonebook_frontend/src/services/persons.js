import axios from 'axios'
const isLocalhost = window.location.hostname === "localhost";
const baseUrl = isLocalhost
  ? "http://localhost:3001/api/persons"
  : "/api/persons";

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = newObject => {
  const request = axios.post(baseUrl, newObject)
  console.log("Creating post request")
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