// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());


// Use environment variable or default to 'localhost'
const mongoHost = process.env.MONGO_HOST || 'localhost';
const uri = `mongodb://${mongoHost}:27017/todoapp`;

// MongoDB connection
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const todoSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Todo Model
const Todo = mongoose.model('Todo', todoSchema);

// Routes
app.get('/api/todos', async (req, res) => {
    try {
        const todos = await Todo.find().sort({ createdAt: -1 });
        res.json(todos);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching todos' });
    }
});

app.post('/api/todos', async (req, res) => {
    try {
        // Validate that text is provided
        if (!req.body.text) {
            return res.status(400).json({ error: 'Text is required' });
        }

        const todo = new Todo({
            text: req.body.text,
            completed: false
        });
        
        const savedTodo = await todo.save();
        res.json(savedTodo);
    } catch (error) {
        res.status(500).json({ error: 'Error creating todo' });
    }
});

app.put('/api/todos/:id', async (req, res) => {
    try {
        const todo = await Todo.findByIdAndUpdate(
            req.params.id,
            { completed: req.body.completed },
            { new: true }
        );
        res.json(todo);
    } catch (error) {
        res.status(500).json({ error: 'Error updating todo' });
    }
});

app.delete('/api/todos/:id', async (req, res) => {
    try {
        await Todo.findByIdAndDelete(req.params.id);
        res.json({ message: 'Todo deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting todo' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});