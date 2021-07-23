require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const Person = require('./models/person')

app.use(express.json())
app.use(morgan(':method :url :status - :response-time ms :data'))
app.use(express.static('build'))

morgan.token('data', function (request, response) {
    return JSON.stringify(request.body)
})


let persons = []
Person.find({}).then(foundPersons => {
    persons = foundPersons
})


app.get('/', (request, response) => {
    response.send('<h1>Phonebook</h1>')
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(found =>{
        if (found) {
            response.json(found)
        } else {
            response.status(404).end()
        }
    })
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)

    response.status(204).end()
})

// const generateId = () => {
//     const personIds = persons.map(p => p.id)
//     let newId = 0

//     do {
//         newId = Math.floor(Math.random() * 10000)
//     } while (personIds.includes(newId))

//     return newId

// }

app.post('/api/persons', (request, response) => {
    const body = request.body
    console.log(body)

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'Name or number missing'
        })
    }

    const personNames = persons.map(p => p.name.toLowerCase())
    console.log(personNames)
    console.log(body.name.toLowerCase())
    if (personNames.includes(body.name.toLowerCase())) {
        return response.status(400).json({
            error: 'Name must be unique, name already exists in phonebook'
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

app.get('/info', (request, response) => {
    let numPeople = persons.length
    response.send(
        `<div>Phonebook has info for ${numPeople} people</div>
        <div>${new Date()}</div>`
        )
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
