const mongoose = require('mongoose');
const config = require('../config/key');
require('dotenv').config();

const connection =mongoose.connect(config.mongoURI, 
    {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false})
    .then( () => console.log('DB connected'))
    .catch(err => console.log(err));

module.exports = connection;