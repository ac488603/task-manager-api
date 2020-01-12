const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
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
        unique: true,
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

//when throwing errors for authentication it is best to be generic
//it exposes less information  
userSchema.statics.findByCredentials = async (email, password) => {
    const user =  await User.findOne({email}); 
    
    if(!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch) {
        throw new Error('Unable to login')
    }

    return user; 
}

//mongoose middleware can only be set up on the user schema.
//this function runs before the save function.  
// it checks to see if the password field was modified on the user object
//if it is modified the new password is hashed
userSchema.pre('save', async function (next) {
    const user = this; 

    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});
const User = mongoose.model('User',userSchema);

module.exports = User;