const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
  }

process.argv.forEach(arg => {
    console.log(arg)
})

const password = process.argv[2]

const url = `mongodb+srv://kevin:${password}@cluster0.sbpdh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

const persons = []

if (process.argv.length < 5) {
    Person.find({}).then(results => {
        results.forEach(person => {
            newPerson = {
                "id": person._id,
                "name": person.name,
                "number": person.number
            }
            persons.push(newPerson)
        })

        mongoose.connection.close()
        console.log('Phonebook: ')
        persons.forEach(person => {
            console.log(person.name + " " + person.number)
        })
    })
}

if (process.argv.length === 5 ) {
    const newPerson = new Person({
        name: process.argv[3],
        number: process.argv[4]
    })

    newPerson.save().then(result => {
        console.log('Person saved!')
        console.log(newPerson)
        mongoose.connection.close()
    })
}

// const getAllPersons = () => {
//     let persons = []

//     Person.find({}).then(results => {
//         results.forEach(person => {
//             newPerson = {
//                 "id": person._id,
//                 "name": person.name,
//                 "number": person.number
//             }

//             persons.push(newPerson)
//         })

//         mongoose.connection.close()
//         return persons
//     })
// }

// const addPerson = (person) => {
//     const newPerson = new Person({
//         name: person.name,
//         number: person.number
//     })

//     newPerson.save().then(result => {
//         console.log('Person saved!')
//         console.log(newPerson)
//         mongoose.connection.close()
//     })
// }
