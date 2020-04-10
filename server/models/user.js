const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        max: 32,
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    /* hashed_password: {
        type: String,
        required: true
    }, */
    salt: String,
    about: {
        type: String
    },
    role: {
        type: Number,
        default: 0,
        trim: true
    },
    resetPasswordLink: {
        data: String,
        default: ''
    },
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
  }, 
  {timestamp:true}
);

userSchema.pre('save', function( next ) {
    var user = this;
    //console.log('I am here');
    if(user.isModified('password')){
        bcrypt.genSalt(saltRounds, function(err, salt){
            
            if(err) return next(err);
    
            bcrypt.hash(user.password, salt, function(err, hash){
                if(err) return next(err);
                user.password = hash;
                next();
            })
        })
    } else {
        next();
    }   
});

userSchema.methods.comparePassword = function(plainPassword, cb) {
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if (err) return cb(err);
        cb(null, isMatch)
    })
}

userSchema.methods.generateToken = function(cb) {
    var user = this;
    var token = jwt.sign(user._id.toHexString(), 'secret');

    user.token = token;
    user.save(function(err, user){
        if(err) return cb(err);
        cb(null, user);
    })
}

userSchema.statics.findByToken = function(token, cb) {
    var user = this;

    jwt.verify(token,'secret', function( err, decode ){
        user.findOne({'_id': decode, 'token': token}, function(err, user){
            if(err) return cb(err);
            cb(null, user);
        })
    })
}
/* userSchema.virtual('password')
  .set(function(password){
      //create a temporary variable called _password
        this._password = password;

      // generate salt
        this.salt = this.makeSalt();

      // encrypt password
        this.hashed_password = this.encryptPassword(password);
  })
  .get(function(){
      return this._password;
  });

userSchema.methods = {
    authenticate: function(plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;
    },

    encryptPassword: function(password){
        if(!password) return '';
        try {
            return crypto.createHmac('sha1', this.salt)
                .update(password)
                .digest('hex');
        } catch (err) {
            return '';
        }
    },

    makeSalt: function(){
        return Math.round(new Date().valueOf() * Math.random()) + '';
    }
} */

const User = mongoose.model('User', userSchema);

module.exports = { User };