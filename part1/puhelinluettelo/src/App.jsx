import { useState, useEffect } from 'react'
import noteService from './services/notes'

const Person = ({ person, deleteSelf }) => {
  return (
    <li>
      {person.name} {person.number}
      <button onClick={deleteSelf}>delete</button>
    </li>
  )
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
    if (persons.some(person => person.name === newPerson.name)) {
      // name already exists, update entry
      console.log(`Person with name ${newPerson.name} already exists, updating number`)
      const id = persons.find(person => person.name === newPerson.name).id
      noteService.update(id, newPerson)
        .then(response => {
          setPersons(persons.map(person => person.id !== id ? person : response))
        })
    } else {
      noteService.create(newPerson)
        .then(response => {
          setPersons(persons.concat(response))
        })
        .catch(error => {
          console.error('Error adding person:', error)
        })
    }
  }

  useEffect(() => {
    console.log('effect')
    noteService.getAll()
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response)
      })
  }, [])

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value);
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const deletePerson = (id) => {
    console.log(`Deleting person with id ${id}`)
    const result = confirm(`Delete ${persons.find(person => person.id === id).name}?`)

    // Delete person if confirmed
    if (result) {
      noteService.deleteItem(id)
      .then(response => {
        console.log('Person deleted:', response)
        setPersons(persons.filter(person => person.id !== id))
      })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form>
        <div>name: <input onChange={handleNameChange} /></div>
        <div>number: <input onChange={handleNumberChange} /></div>
        <div><button type="submit" onClick={addPerson}>add</button></div>
      </form>
      <h2>Numbers</h2>
      <ul>
        {persons.map(person =>
          <Person key={person.id} person={person} deleteSelf={() => deletePerson(person.id)} />
        )}
      </ul>
    </div>
  )

}

export default App