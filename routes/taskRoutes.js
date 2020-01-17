const express = require('express'); 
const router =  new express.Router(); 
const auth = require('./middleware/auth');
const Task = require('../models/Task');

// create a task 
router.post('/tasks', auth, async (req,res) => {
    const tsk = Task({...req.body, author : req.user._id}); 

    try {
        await tsk.save();
        res.status(201).send(tsk);
    } catch (error) {
        res.status(400).send();
    }
});


// get all tasks
router.get('/tasks',auth, async (req,res) => {

    try {
        await req.user.populate('tasks').execPopulate();
        res.send(req.user.tasks);
    } catch (error) {
        res.status(500).send()
    }
});


//edit a user by id
router.patch('/tasks/:id', async (req,res) => {
    const _id = req.params.id;
    const potentialUpdates = Object.keys(req.body); 
    const allowedUpdates = ['description'];

    const isValid = potentialUpdates.every( item => allowedUpdates.includes(item));

    if(!isValid){
        return res.status(400).send({error:`not a valid update`});
    }
    try {
        const usr = await Task.findByIdAndUpdate(_id, req.body, {new: true, runValidators: true});
        
        if(!usr){
            return res.status(404).send();
        }

        res.send(usr); 
    } catch (error) {
        res.status(500).send(error);
    }
});

//delet a task
router.delete('/tasks/:id', async(req,res) => {
    const _id = req.params.id;
    
    try {
        const tsk = await Task.findByIdAndDelete({_id}); 
        if(!tsk){
            return res.status(404).send();
        }
        res.send(tsk);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;