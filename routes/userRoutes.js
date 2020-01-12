const express = require('express'); 
const router =  new express.Router(); 
const auth = require('./middleware/auth'); 

const User = require('../models/User');

//create a new user
router.post('/users', async (req, res) => {
    const Usr = User(req.body);

    try {
        const token = await Usr.generateAuthToken(); 
        await Usr.save();
        res.status(201).send({usr, token}); 
    } catch (error) {
        res.status(400).send(err);
    }
});


// get all users
router.get('/users', auth,(req,res) => {
    res.send(req.user);
});

//get a user by id
router.get('/users/:id', (req, res) => {
    const _id = req.params.id;
    User.findById(_id).then( usr => {
        if(!usr){
            return res.status(404).send();
        }
        res.send(usr);
    }).catch( err => {
        res.status(500).send(); 
    })
});

//edit a user by id
router.patch('/users/:id', async (req,res) => {
    const _id = req.params.id;
    const potentialUpdates = Object.keys(req.body); 
    const allowedUpdates = ['name', 'email', 'password', 'age'];

    const isValid = potentialUpdates.every( item => allowedUpdates.includes(item));

    if(!isValid){
        return res.status(400).send({error:`Not a valid update.`});
    }
    try {

        const usr = await User.findById(req.params.id);
        
        if(!usr){
            return res.status(404).send();
        }

        potentialUpdates.forEach( (update) => usr[update] = req.body[update]); // add updates to user 
        await usr.save(); //  validate and save updates
        
        //const usr = await User.findByIdAndUpdate(_id, req.body, {new: true, runValidators: true});
        res.send(usr); 
    } catch (error) {
        res.status(500).send(error);
    }
});

//delete and return the user
router.delete('/users/:id', async(req,res) => {
    const _id = req.params.id;
    
    try {
        const usr = await User.findByIdAndDelete({_id}); 
        if(!usr){
            return res.status(404).send();
        }
        res.send(usr);
    } catch (error) {
        res.status(500).send(error);
    }
});


// end point for user authentication
// the method findBycredentials is a user created function that exists on the user model
router.post('/users/login', async (req,res) => {
    try {
        const usr =  await User.findByCredentials(req.body.email,req.body.password);
        const token = await usr.generateAuthToken();

        res.send({usr,token});
    } catch(e) {
        console.log(e);
        res.status(400).send()
    } 
})

module.exports = router; 