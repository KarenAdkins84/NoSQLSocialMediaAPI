const connection = require('../config/connection');
const { User, Thought } = require('./models');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/test',
{ useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log('Mongo connection open');
})
.catch((err) => {
    console.log(err);
});

const seedUsers = [
    {
        username: 'Hayden',
        email: 'hay1129@gmail.com',
        thoughts: 'Here is my big idea...',
        friends: ['Karen', 'Aspen']
    }
]//finish seeding
