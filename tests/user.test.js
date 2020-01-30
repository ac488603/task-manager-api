const request = require('supertest');
const app = require('../app');
const User = require('../models/User');
const mongoose =require('mongoose');
const jwt = require('jsonwebtoken');

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

beforeEach(async () => {
    await User.deleteMany();
    await new User(userOne).save();
    
})

test('should signup new user', async () => {
   const response = await request(app).post('/users').send({
        "name": "king",
        "email": "kinghenry@example.com",
        "password": "asdfnlfsd34223!",
        "age": 24
    }).expect(201)

    //check if user is added to database
    const usr = await User.findById(response.body.Usr._id);
    expect(usr).not.toBeNull();

    //check if correct correct name and email are added to database
    //check if authentication token is created
    expect(response.body).toMatchObject({
        Usr:{
            name: "king",
            email: "kinghenry@example.com"
        },
        token : usr.tokens[0].token
    })

    //check if password is hashed
    expect(usr.password).not.toBe('asdfnlfsd34223')
})

test('should login existing user', async ()=> {
    const response = await request(app).post('/users/login').send({
        email : userOne.email,
        password: userOne.password
    }).expect(200);

    //check if auth token matches token in database
    const usr = await User.findById(userOneID);
    expect(response.body.token).toBe(usr.tokens[1].token)


})

test('should not login', async () => {
    await request(app).post('/users/login').send({
        email : userOne.email,
        password: "sakndkss123"
    }).expect(400)
})

test('should get profile', async () => {
    await request(app).get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);
})

test('should fail to get profile', async () => {
    await request(app).get('/users/me')
        .send()
        .expect(401)
});

test('should delete user',  async () => {
    await request(app).delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    const usr =  await User.findById(userOneID);
    expect(usr).toBeNull()
} )

test('should fail to delete user', async () => {
    await request(app).delete('/users/me')
        .send()
        .expect(401)
})