require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const Person = require('./models/person')

app.use(express.static('build'))
app.use(express.json())
app.use(morgan(':method :url :status - :response-time ms :data'))

morgan.token('data', function (request) {
	return JSON.stringify(request.body)
})

app.get('/', (request, response) => {
	response.send('<h1>Phonebook</h1>')
})

app.get('/api/persons', (request, response) => {
	Person.find({}).then(persons => {
		response.json(persons)
	})
})

app.get('/api/persons/:id', (request, response, next) => {
	if (request.params.id.length !== 24) {
		console.log('Error: Malformatted ID')
		throw 'Malformatted ID'
	} else {
		Person.findById(request.params.id).then(found => {
			if (found) {
				response.json(found)
			} else {
				response.status(404).end()
			}
		})
			.catch(error => {
				next(error)
			})
	}
})

app.delete('/api/persons/:id', (request, response, next) => {
	Person.findByIdAndRemove(request.params.id).then(result => {
		console.log(result)
		response.status(204).end()
	})
		.catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
	const body = request.body

	const person = {
		name: body.name,
		number: body.number
	}

	console.log(person)

	Person.findByIdAndUpdate(request.params.id, person)
		.then(updatedPerson => {
			console.log(updatedPerson)
			response.json(updatedPerson)
		})
		.catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
	const body = request.body
	console.log(body)

	const person = new Person({
		name: body.name,
		number: body.number
	})

	person.save().then(savedPerson => {
		response.json(savedPerson)
	}).catch(error => next(error))
})

app.get('/info', (request, response) => {
	Person.find({}).then(foundPersons => {
		response.send(
			`<div>Phonebook has info for ${foundPersons.length} people</div>
            <div>${new Date()}</div>`
		)
	})
})

const errorHandler = (error, request, response, next) => {
	console.error(error.message)

	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' })
	} else if (error.name === 'ValidationError') {
		return response.status(400).json({ error: error.message })
	}

	next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
