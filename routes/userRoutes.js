const express = require('express'); 
const router =  new express.Router(); 
const auth = require('./middleware/auth'); 

const User = require('../models/User');

//create a new user
router.post('/users', async (req, res) => {
    const Usr = User(req.body);

    try {
        const token = await Usr.generateAuthToken(); 
        res.status(201).send({Usr, token}); 
    } catch (error) {
        res.status(400).send(error);
    }
});


// get all users
router.get('/users/me', auth,(req,res) => {
    res.send(req.user);
});


//edit a user by id
router.patch('/users/:id', auth, async (req,res) => {
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
router.delete('/users/me', auth, async (req,res) => {
    
    try {
        await req.user.remove();
        res.send(req.user);
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
        res.status(400).send()
    } 
});

router.post('/users/logout', auth, async (req,res) => {
    try {
        req.user.tokens = req.user.tokens.filter( tkn => tkn.token !== req.token);
        await req.user.save();

        res.send('logged out');
    } catch (error) {
        res.status(500).send();
    }
});

router.post('/users/logoutall', auth , async (req,res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send(req.user);
    } catch (error) {
        res.status(500).send()
    }
} );


module.exports = router; 