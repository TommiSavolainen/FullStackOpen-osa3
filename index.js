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

app.get('/api/info', (request, response) => {
    const day = new Date();
    Person.countDocuments({})
        .then((count) => {
            response.send(`<p>Phonebook has info for ${count} people</p><p>${day}</p>`);
        })
        .catch((error) => {
            console.error(error);
            response.status(500).send('Error counting documents');
        });
});

app.get('/api/persons/:id', (request, response, next) => {
    console.log(request.params.id);
    Person.findById(request.params.id)
        .then((person) => {
            console.log(person);
            if (person) {
                response.json(person);
            } else {
                response.status(404).end();
            }
        })
        .catch((error) => {
            console.log(error);
            next(error);
        });
});

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

app.post('/api/persons', (request, response, next) => {
    const body = request.body;
    if (body.name === undefined) {
        return response.status(400).json({ error: 'name missing' });
    }
    const person = new Person({
        name: body.name,
        number: body.number,
    });

    person
        .save()
        .then((savedPerson) => {
            response.json(savedPerson);
        })
        .catch((error) => next(error));
    morgan.token('data', (request) => JSON.stringify(request.body));
});

const errorHandler = (error, request, response, next) => {
    console.error(error.message);

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' });
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message });
    }
    next(error);
};

// tämä tulee kaikkien muiden middlewarejen ja routejen rekisteröinnin jälkeen!
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
