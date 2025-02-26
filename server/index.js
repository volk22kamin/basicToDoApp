import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import serverless from 'serverless-http';

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { log } from 'console';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "*");
    next();
});


// MongoDB connection
const uri = process.env.MONGODB_URI || `mongodb://172.31.3.102:27017/todoapp`;

mongoose.connect(uri);

mongoose.connection.on('error', (err) => {
    console.error('Database connection error:', err);
});

mongoose.connection.once('open', () => {
    console.log('Database connected successfully.');
});

// Define Schema and Model
const todoSchema = new mongoose.Schema({
    text: { type: String, required: true },
    completed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

const Todo = mongoose.model('Todo', todoSchema);

// API Routes
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
        if (!req.body.text) {
            return res.status(400).json({ error: 'Text is required' });
        }

        const todo = new Todo({ text: req.body.text, completed: false });
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

// export const handler = async (event) => {
//     return {
//         statusCode: 200,
//         headers: {
//             "Access-Control-Allow-Origin": "*",  // Allow all origins (change if needed)
//             "Access-Control-Allow-Methods": "OPTIONS, GET, POST, PUT, DELETE",
//             "Access-Control-Allow-Headers": "*"
//         },
//         body: JSON.stringify({ message: "Success" })
//     };
// };

export const handler = serverless(app);

// If running locally, start the server
if (process.env.NODE_ENV !== 'production') {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    });
}