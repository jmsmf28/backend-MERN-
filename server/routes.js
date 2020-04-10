const express = require('express');
const routes = express.Router();
const { User } = require('./models/user');
const { auth } = require('./middleware/auth');

routes.get('/api/user/auth', auth, (req, res) => {
    res.status(200).json({
        _id: req.id,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        role: req.user.role
    });
});

routes.post('/api/users/register', (req, res) => {
    const user = new User(req.body);

    user.save((err, userData) => {
        if(err) return res.json({ success: false, err })
        return res.status(200).json({
            success: true,
            message: 'User registed!',
            details: userData
        })     
    })
});

routes.post('/api/user/login', (req, res) => {
    // find the email
    User.findOne({ email: req.body.email }, (err, user) => {
        if(!user)
        return res.json({
            loginSuccess: false,
            message: 'Authentication failed, email or password doesn`t match!!!'
        });
        // comparePassword
        user.comparePassword(req.body.password, (err, isMatch) => {
            if(!isMatch){
                return res.json({ 
                    loginSuccess: false,
                    message: 'Authenticattion failed, email or password doesn`t match!!!'
                })
            }
        })
        //generateToken
        user.generateToken((err, user) => {
            if(err) return res.status(400).send(err);
            res.cookie("x_auth", user.token)
                .status(200)
                .json({
                    loginSuccess: true,
                });
        });
    });
});

routes.get('/api/user/logout', auth, (req, res) => {
    User.findOneAndUpdate( { _id: req.user._id }, { token: ''}, (err, doc) => {
        if(err) return res.json({success: fals, err});
        return  res.status(200).send({ success: true });
    });
});

module.exports = routes;