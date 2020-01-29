const express = require('express'); 
const app = express(); 
require('./src/db/mongoose'); // This forces the script to run. 

//import routers 
const userRouter = require('./routes/userRoutes');
const taskRouter = require('./routes/taskRoutes');

//set up express middleware

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

module.exports = app;

