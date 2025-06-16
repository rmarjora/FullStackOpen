require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const Person = require('./models/person')

app.use(express.static('dist'))
app.use(express.json())
morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        console.log("Validationerror")
        return response.status(400).json({error: error.message})
    }

    next(error)
}

app.use(errorHandler)

app.get('/info', (request, response, next) => {
    Person.countDocuments({})
        .then(count => {
            const date = new Date()
            const info = `<p>Phonebook has info for ${count} people</p>
                          <p>${date}</p>`
            response.status(200).send(info)
        })
        .catch(error => next(error))
})

app.get('/api/persons', (request, response, next) => {
    Person.find({})
        .then(persons => {
            response.json(persons.map(p => p.toJSON()))
        })
        .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person.toJSON())
            } else {
                response.status(404).send({ error: 'Person not found' })
            }
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(() => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

const createOrUpdatePerson = (person) => {
    const promise = Person.findOne({name: person.name})
        .then(existingPerson => {
            if (existingPerson) {
                console.log(`Person ${existingPerson.name} exists`)
                return Person.findByIdAndUpdate(existingPerson._id, person, { new: true, runValidators: true })
            } else {
                console.log(person)
                const newPerson = new Person({
                    name: person.name,
                    number: person.number
                })
                console.log(`Creating new person ${newPerson.toObject()}`) // "newPerson" has only field "_id" and nothing more???
                return newPerson.save()
            }
        })
        
    return promise
}

app.post('/api/persons', (request, response, next) => {
    const person = request.body
    createOrUpdatePerson(person)
        .then(savedPerson => {
            response.status(201).json(savedPerson)
        })
        .catch(error => next(error))
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})