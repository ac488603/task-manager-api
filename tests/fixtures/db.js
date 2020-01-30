const mongoose =require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');


const userOneID =  new mongoose.Types.ObjectId();
const userOne = {
    _id: userOneID,
    name : "buddy",
    password: "BigMoneyMike",
    email:"mikemike@example.com",
    age: 17,
    tokens:[{
        token: jwt.sign({_id: userOneID}, process.env.JWT_SECRET)
    }]
}

const setupDatabase = async () => {
    await User.deleteMany();
    await new User(userOne).save()
}

module.exports = {
    setupDatabase,
    userOne,
    userOneID
}