import { useState, useEffect } from 'react'
import personService from './services/persons'
import Notification from './components/Notification'

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
  const [filter, setFilter] = useState('')
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [notification, setNotification] = useState({message: null, color: 'green'})

  const displayNotification = (message, color = 'green', duration=5000) => {
    setNotification({message, color});
    setTimeout(() => {
      setNotification({...notification , message: null});
    }, duration);
  }

  const addPerson = (event) => {
    event.preventDefault();
    const newPerson = { name: newName, number: newNumber }
    console.log(`Adding ${newPerson.name} with number ${newPerson.number}`)
    if (persons.some(person => person.name === newPerson.name)) {
      // name already exists, update entry
      console.log(`Person with name ${newPerson.name} already exists, updating number`)
      const id = persons.find(person => person.name === newPerson.name).id
      personService.update(id, newPerson)
        .then(response => {
          setPersons(persons.map(person => person.id !== id ? person : response))
          displayNotification(`Changed ${newPerson.name}'s number`)
        })
        .catch(error => {
          console.log('Error updating person:', error)
          displayNotification(`Information of ${newPerson.name} has already been removed from the server`, 'red')
        })
    } else {
      personService.create(newPerson)
        .then(response => {
          setPersons(persons.concat(response))
          displayNotification(`Added ${newPerson.name}`)
        })
        .catch(error => {
          console.error('Error adding person:', error)
        })
    }
  }

  useEffect(() => {
    console.log('effect')
    personService.getAll()
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response)
      })
  }, [])

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  }

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
      personService.deleteItem(id)
      .then(response => {
        console.log('Person deleted:', response)
        setPersons(persons.filter(person => person.id !== id))
      })
    }
  }

  const personsToShow = persons.filter(person => 
    person.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification} />
      <div>filter shown with
        <input type="text" onChange={handleFilterChange}/>
      </div>
      <h2>add a new</h2>
      <form>
        <div>name: <input onChange={handleNameChange} /></div>
        <div>number: <input onChange={handleNumberChange} /></div>
        <div><button type="submit" onClick={addPerson}>add</button></div>
      </form>
      <h2>Numbers</h2>
      <ul>
        {personsToShow.map(person =>
          <Person key={person.id} person={person} deleteSelf={() => deletePerson(person.id)} />
        )}
      </ul>
    </div>
  )

}

export default App