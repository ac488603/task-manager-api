const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./Task');

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
    },
    avatar : {
        type: Buffer
    },
    tokens : [{
        token: {
            type: String,
            required: true
        }
    }]
});

//virtual properties are not stored in the database
//They are used by mongoose to create an index.  The index stores 
//a relationship between models

userSchema.virtual('tasks', {
    ref : 'Task',
    localField :'_id',
    foreignField: 'author' //name of field on other model
});
//instance method to remove private data
// this function is called by the send function 
userSchema.methods.toJSON = function () {
    const user = this;
    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.tokens;
    return userObj;
}

//instance method -> belongs to a instance
userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET);
    user.tokens.push({token});
    await user.save();
    return token;
}

//when throwing errors for authentication it is best to be generic
//it exposes less information
//Model method -> belongs to the model  
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

//middleware used to delete tasks it user deletes themselves
userSchema.pre('remove', async function (next) {
    const user = this;
    await Task.deleteMany({author : user._id});
    next();
})

const User = mongoose.model('User',userSchema);

module.exports = User;