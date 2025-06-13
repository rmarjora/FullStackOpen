require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const Person = require('./models/person')

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
    Person.countDocuments({})
        .then(count => {
            const date = new Date()
            const info = `<p>Phonebook has info for ${count} people</p>
                          <p>${date}</p>`
            response.status(200).send(info)
        })
        .catch(error => {
            console.error('Error fetching count:', error)
            response.status(500).send({ error: 'Failed to fetch count' })
        })
})

app.get('/api/persons', (request, response) => {
    Person.find({})
        .then(persons => {
            response.json(persons.map(p => p.toJSON()))
        })
        .catch(error => {
            console.error('Error fetching persons:', error)
            response.status(500).send({ error: 'Failed to fetch persons' })
        })
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person.toJSON())
            } else {
                response.status(404).send({ error: 'Person not found' })
            }
        })
        .catch(error => {
            console.error('Error fetching person:', error)
            response.status(500).send({ error: 'Failed to fetch person' })
        })
})

app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndRemove(request.params.id)
        .then(() => {
            response.status(204).end()
        })
        .catch(error => {
            console.error('Error deleting person:', error)
            response.status(500).send({ error: 'Failed to delete person' })
        })
})

app.post('/api/persons', (request, response) => {
    const name = request.body.name
    const number = request.body.number
    if (!name || !number) {
        return response.status(400).json({ error: 'name or number is missing' })
    } else if (Person.findOne({ name })) {
        return response.status(400).json({ error: 'name must be unique' })
    } else {
        const person = new Person({
            name,
            number
        })

        person.save()
            .then(savedPerson => {
                response.status(201).json(savedPerson.toJSON())
            })
            .catch(error => {
                console.error('Error saving person:', error)
                response.status(500).send({ error: 'Failed to save person' })
            })
    }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})