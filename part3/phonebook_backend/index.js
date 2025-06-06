const express = require('express')
const app = express()
const morgan = require('morgan')

app.use(express.static('dist'))
app.use(express.json())
morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let phonebook = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/info', (request, response) => {
    const date = new Date()
    const info = `<p>Phonebook has info for ${phonebook.length} people</p>
                  <p>${date}</p>`
    response.send(info)
})

app.get('/api/persons', (request, response) => {
    response.json(phonebook)
})

app.get('/api/persons/:id', (request, response) => {
    const person = phonebook.find(p => p.id === request.params.id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).send({ error: 'Person not found' })
    }
})

app.delete('/api/persons/:id', (request, response) => {
    console.log(`Deleting person with id: ${request.params.id}`)
    phonebook = phonebook.filter(p => p.id !== request.params.id)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const id = Math.floor(Math.random()*1000000000)
    console.log(`Adding new person with id: ${id}`)
    const newPerson = {
        id: id.toString(),
        name: request.body.name,
        number: request.body.number
    }

    if (!newPerson.name || !newPerson.number) {
        return response.status(400).json({ error: 'name or number is missing' })
    } else if (phonebook.some(p => p.name === newPerson.name)) {
        return response.status(400).json({ error: 'name must be unique' })
    } else {
        phonebook.push(newPerson)
        response.status(201).json(newPerson)
    }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})