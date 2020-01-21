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
    const match = {}; 

    if(req.query.completed){
        match.completed = req.query.completed === 'true';
    }


    try {
        await req.user.populate({
            path: 'tasks',
            match
        }).execPopulate();
        res.send(req.user.tasks);
    } catch (error) {
        res.status(500).send()
    }
});


//get a task by id
router.get('/tasks/:id', auth, async (req, res) => {

    try {
        const task = await Task.findOne({_id: req.params.id , author : req.user._id});
        if(!task){
            return res.status(404).send()
        }
        res.send(task);
    } catch (error) {
        res.status(500).send()
    }
});


//edit a user by id
router.patch('/tasks/:id', auth, async (req,res) => {
    const _id = req.params.id;
    const potentialUpdates = Object.keys(req.body); 
    const allowedUpdates = ['description'];

    const isValid = potentialUpdates.every( item => allowedUpdates.includes(item));

    if(!isValid){
        return res.status(400).send({error:`not a valid update`});
    }


    try {
        const tsk = await Task.findOne({_id, author: req.user._id});
        
        if(!tsk){
            return res.status(404).send();
        }

        potentialUpdates.forEach(update => tsk[update] = req.body[update] );
        await tsk.save();
        res.send(tsk); 
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