const express = require('express'); 
const router =  new express.Router(); 

const Task = require('../models/Task');

// create a task 
router.post('/tasks', (req,res) => {
    const tempTask = Task(req.body); 
    tempTask.save().then( tsk => {
         res.status(201).send(tsk);
    }).catch( err => {
         res.status(400).send(err); 
    });
});


// get all tasks
router.get('/tasks', (req,res) => {
    Task.find().then( tsks => {
        res.send(tsks);
    }).catch( err => {
        res.status(500).send();
    })
});


//get a task by id
router.get('/tasks/:id', (req, res) => {
    const _id = req.params.id;
    Task.findById(_id).then( tsk => {
        if(!tsk){
            return res.status(404).send();
        }
        res.send(tsk);
    }).catch( err => {
        res.status(500).send(); 
    })
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