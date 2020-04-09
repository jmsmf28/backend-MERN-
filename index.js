const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
//const cors = require('cors');
const mongoose = require('mongoose');
const { User } = require('./models/user');


require('dotenv').config();

// app
const app =  express();

// db
mongoose.connect(process.env.DATABASE_LOCAL, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false})
.then( () => console.log('DB connected'))
.catch(err => console.log(err));

//middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

//routes
app.get('/', (req, res) => {
    res.send('Hello');
});

app.post('/api/users/register', (req, res) => {
    const user = new User(req.body);

    user.save((err, userData) => {
        if(err) return res.json({ success: false, err })
        return res.status(200).json({
            success: true,
            message: 'User registed!',
            details: userData
        })     
    })
})


//port 
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});