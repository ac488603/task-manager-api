const express = require('express'); 
const router =  new express.Router(); 

const User = require('../models/User');

//create a new user
router.post('/users', (req, res) => {
    const tempUsr = User(req.body); 
    tempUsr.save().then((usr) => {
        res.status(201).send(usr); 
    }).catch((err) => {
        res.status(400).send(err);
    });
});


// get all users
router.get('/users', (req,res) => {
    User.find().then( usrs => {
        res.send(usrs);
    }).catch( err => {
        res.status(500).send();
    })
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
        return res.status(400).send({error:`not a valid update`});
    }
    try {
        const usr = await User.findByIdAndUpdate(_id, req.body, {new: true, runValidators: true});
        
        if(!usr){
            return res.status(404).send();
        }

        res.send(usr); 
    } catch (error) {
        res.status(500).send(error);
    }
});

//delete a user
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

module.exports = router; 