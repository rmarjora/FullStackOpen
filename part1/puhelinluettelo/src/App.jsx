import { useState, useEffect } from 'react'
import axios from 'axios'
import noteService from './services/notes'

const Person = ({ person }) => {
  return <li>{person.name} {person.number}</li>
}

const Numbers = (props) => {
  return (
    <>
      <h2>Numbers</h2>
      <ul>
        {props.persons.map(person =>
          <Person key={person.name} person={person} />
        )}
      </ul>
    </>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const addPerson = (event) => {
    event.preventDefault();
    const newPerson = { name: newName, number: newNumber }
    console.log(`Adding ${newPerson.name} with number ${newPerson.number}`)
    noteService.create(newPerson)
      .then(response => {
        setPersons(persons.concat(response.data))
      })
      .catch(error => {
        console.error('Error adding person:', error)
      })
  }

  useEffect(() => {
    console.log('effect')
    axios.get('http://localhost:3001/persons')
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response.data)
      })
  }, [])

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value);
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form>
        <div>name: <input onChange={handleNameChange} /></div>
        <div>number: <input onChange={handleNumberChange} /></div>
        <div><button type="submit" onClick={addPerson}>add</button></div>
      </form>
      <Numbers persons={persons}/>
    </div>
  )

}

export default App