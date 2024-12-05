const express = require('express'); 
const cors = require('cors'); 
require('dotenv').config(); 
const Todo = require('./models/Todo');
const mongoose = require('mongoose'); 


const app = express(); 

app.use(express.json()); 
app.use(cors()); 

const port = 4001; 

const connectionString = process.env.MONGO_URI; 
mongoose.connect(connectionString)
.then(() => console.log('Connected to the database…'))
.catch((err) => console.error('Connection error:', err));

//Routes 
app.get('/todo', async (req, res) => { 
   const allTasks = await Todo.find();
   res.json(allTasks)
 });

app.post('/todo/new', async (req,res) => {
    console.log(req.body);
    const newTask = await Todo.create(req.body);
    res.status(201).json({newTask})
})

app.delete('/todo/delete/:id', async (req, res) => {
    console.log('DELETE request received with ID:', req.params.id);
    try {
        const result = await Todo.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json(result);
    } catch (err) {
        console.error('Error during DELETE:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => console.log(`Server is running on port ${port}`));
