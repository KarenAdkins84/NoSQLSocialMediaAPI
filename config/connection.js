const { connect, connection } = require('mongoose');


    process.env.MONGODB_URI || 'mongodb://localhost:27017';

connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

module.exports = connection;
