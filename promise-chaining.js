require('./src/db/mongoose');

const Task = require('./models/Task'); 

Task.findOneAndDelete('5e05b59387dfdf38b1150089').then( _ => {
    return Task.find({completed : false})
}).then( docs => {
    console.log(docs);
}).catch( err => {
    console.log(err); 
})

