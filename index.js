require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const app = express();
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'));
morgan.token('data', (request) => JSON.stringify(request.body));
const cors = require('cors');
app.use(cors());
app.use(express.static('dist'));
const Person = require('./models/person');
// let persons = [
//     {
//         id: 1,
//         name: 'Arto Hellas',
//         number: '040-123456',
//     },
//     {
//         id: 2,
//         name: 'Ada Lovelace',
//         number: '39-44-5323523',
//     },
//     {
//         id: 3,
//         name: 'Dan Abramov',
//         number: '12-43-234345',
//     },
//     {
//         id: 4,
//         name: 'Mary Poppendick',
//         number: '39-23-6423122',
//     },
// ];

app.get('/api/persons', (request, response) => {
    Person.find({}).then((person) => {
        response.json(person);
    });
});
// app.get('/api/persons/:id', (request, response) => {
//     const id = Number(request.params.id);
//     const person = persons.find((person) => person.id === id);
//     if (person) {
//         response.json(person);
//     } else {
//         response.status(404).end();
//     }
// });

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter((person) => person.id !== id);

    response.status(204).end();
});

app.get('/info', (request, response) => {
    const day = new Date();
    response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${day}</p>`);
});

// app.get('/api/persons', (request, response) => {
//     response.json(persons);
// });

// const generateId = () => {
//     const maxId = persons.length > 0 ? Math.max(...persons.map((n) => n.id)) : 0;
//     return maxId + 1;
// };

app.post('/api/persons', (request, response) => {
    const body = request.body;
    console.log(body);
    if (body.name === undefined) {
        return response.status(400).json({ error: 'name missing' });
    }
    // persons.forEach((person) => {
    //     if (person.name == body.name) {
    //         return response.status(400).json({
    //             error: 'name must be unique',
    //         });
    //     }
    // });
    const person = new Person({
        name: body.name,
        number: body.number,
    });

    person.save().then((savedPerson) => {
        response.json(savedPerson);
    });
    // persons = persons.concat(person);

    // console.log(person);
    morgan.token('data', (request) => JSON.stringify(request.body));
    // response.json(person);
});
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
