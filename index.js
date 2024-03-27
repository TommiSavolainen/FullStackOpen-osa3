require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const app = express();
app.use(express.json());
// app.use(requestLogger);
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'));
morgan.token('data', (request) => JSON.stringify(request.body));
const cors = require('cors');
app.use(cors());
app.use(express.static('dist'));
const Person = require('./models/person');

app.get('/api/persons', (request, response) => {
    Person.find({}).then((person) => {
        response.json(person);
    });
});

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then((result) => {
            response.status(204).end();
        })
        .catch((error) => next(error));
});

// app.get('/info', (request, response) => {
//     const day = new Date();
//     response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${day}</p>`);
// });

app.get('/api/persons:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then((person) => {
            if (person) {
                response.json(person);
            } else {
                response.status(404).end();
            }
        })
        .catch((error) => next(error));
});

// const generateId = () => {
//     const maxId = persons.length > 0 ? Math.max(...persons.map((n) => n.id)) : 0;
//     return maxId + 1;
// };

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body;

    const person = {
        name: body.name,
        number: body.number,
    };

    Person.findByIdAndUpdate(request.params.id, person, { new: true })
        .then((updatedPerson) => {
            response.json(updatedPerson);
        })
        .catch((error) => next(error));
});

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

    morgan.token('data', (request) => JSON.stringify(request.body));
});

const errorHandler = (error, request, response, next) => {
    console.error(error.message);

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' });
    }

    next(error);
};

// tämä tulee kaikkien muiden middlewarejen ja routejen rekisteröinnin jälkeen!
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
