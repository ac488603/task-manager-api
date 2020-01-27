const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true
}, (err) => { 
    if(err){
        return console.log('Couldnt connect to database!')
    }
    
    console.log('Connected to database on port 27017')
 })
