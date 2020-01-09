const express = require('express'); 
const app = express(); 
const PORT =  process.env.PORT || 3000;
require('./src/db/mongoose'); // This forces the script to run. 

//import routers 
const userRouter = require('./routes/userRoutes');
const taskRouter = require('./routes/taskRoutes');

//set up express middleware
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.get('/', (req, res) => {
    res.send('We are live.');
}); 



app.listen(PORT, (_) => {
    console.log(`Server Listening on port ${PORT}`); 
}); 



