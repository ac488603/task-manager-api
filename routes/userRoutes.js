const express = require('express'); 
const router =  new express.Router(); 
const auth = require('./middleware/auth'); 
const multer = require('multer');


const User = require('../models/User');

// The file size option recieves a size in bytes. So 1000000 bytes = 1mb.
// Any file larger than 1mb will be rejected. 
// The multer object can also receive a file filter option. This option allows the
// developer to specify which files the server will accept.
const upload = multer({
        limits : {
            fileSize : 1000000,
        },
        fileFilter(req,file,cb) {
            if(!file.originalname.match(/\.(jpg|jpeg|png)$/) ){
              return cb(new Error('Please upload an image file.'));
            }
            cb(undefined, true);
        }
});

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

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req,res) => {
    req.user.avatar = req.file.buffer;
    await req.user.save();
    res.send();
},(error, req,res, next) => {
    res.status(400).send({error : error.message});
});

router.delete('/users/me/avatar', auth, async (req,res) => {
    if(req.user.avatar === undefined){
        res.status(404).send({message : 'no image exists'})
    }
    req.user.avatar = undefined; 
    try {
        await req.user.save();
        res.send()
    }catch{
        res.status(500).send()
    }
})

// get all users
router.get('/users/me', auth,(req,res) => {
    res.send(req.user);
});


//edit a user by id
router.patch('/users/me', auth, async (req,res) => {
    const potentialUpdates = Object.keys(req.body); 
    const allowedUpdates = ['name', 'email', 'password', 'age'];

    const isValid = potentialUpdates.every( item => allowedUpdates.includes(item));

    if(!isValid){
        return res.status(400).send({error:`Not a valid update.`});
    }
    try {
        potentialUpdates.forEach( (update) => req.user[update] = req.body[update]); // add updates to user 
        await req.user.save(); //  validate and save updates
        
        res.send(req.user); 
    } catch (error) {
        res.status(500).send(error);
    }
});
        //const usr = await User.findByIdAndUpdate(_id, req.body, {new: true, runValidators: true});

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