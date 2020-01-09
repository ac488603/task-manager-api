const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/task-manger-api', {
    useNewUrlParser: true,
    useCreateIndex: true
}, (err) => { 
    if(err){
        return console.log('Couldnt connect to database!')
    }
    
    console.log('Connected to database on port 27017')
 })
