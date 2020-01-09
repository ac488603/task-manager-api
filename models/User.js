const mongoose = require('mongoose');
const validator = require('validator');

const User = mongoose.model('User', {
    name : {
        type: String,
        required: true,
        trim: true
    },
    age : {
        type: Number,
        required: true,
        validate :{
            validator(value){
                if(value < -1){
                    throw new Error('Age must be a positive number.');
                }
            }
        }
    },
    password : {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate: {
            validator(value) {
                if(value.toLowerCase().includes('password') ){
                    throw new Error('The password must not contain the word password.');
                }
            }
        }
    },
    email: {
        required: true,
        type: String,
        trim: true,
        lowercase: true,
        validate : {
            validator(value) {
                if(!validator.isEmail(value)){
                    throw new Error('Invalid Email.');
                }
            }
        }
    }
});

module.exports = User;