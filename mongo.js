const mongoose = require('mongoose');

if (process.argv.length < 3) {
    console.log('give password as argument');
    process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://tommisavolainen79:${password}@cluster0.o1opl.mongodb.net/Persons?retryWrites=true&w=majority`;

mongoose.set('strictQuery', false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
    name: String,
    number: Number,
});

const Person = mongoose.model('Person', personSchema);

if (process.argv.length === 3) {
    Person.find({}).then((result) => {
        result.forEach((person) => {
            console.log(person);
        });
        mongoose.connection.close();
    });
} else if (process.argv.length === 5) {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
    });

    person.save().then((result) => {
        console.log('person saved!');
        mongoose.connection.close();
    });
}

// const person = new Person({
//     name: 'Pekka Mikkola',
//     number: '050654321',
// });

// person.save().then((result) => {
//     console.log('person saved!');
//     mongoose.connection.close();
// });
