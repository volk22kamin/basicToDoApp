import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import awsServerlessExpress from 'aws-serverless-express';
// import { APIGatewayProxyEvent, Context } from 'aws-lambda';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
// const uri = process.env.MONGODB_URI || `mongodb://13.38.8.218:27017/todoapp`;

// mongoose.connect(uri);

// mongoose.connection.on('error', (err) => {
//     console.error('Database connection error:', err);
// });

// mongoose.connection.once('open', () => {
//     console.log('Database connected successfully.');
// });

// // Define Schema and Model
// const todoSchema = new mongoose.Schema({
//     text: { type: String, required: true },
//     completed: { type: Boolean, default: false },
//     createdAt: { type: Date, default: Date.now }
// });

// const Todo = mongoose.model('Todo', todoSchema);

// API Routes
app.get('/api/todos', async (req, res) => {
    try {
        // const todos = await Todo.find().sort({ createdAt: -1 });
        res.json(["hello", "world"]);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching todos' });
    }
});

// app.post('/api/todos', async (req, res) => {
//     try {
//         if (!req.body.text) {
//             return res.status(400).json({ error: 'Text is required' });
//         }

//         const todo = new Todo({ text: req.body.text, completed: false });
//         const savedTodo = await todo.save();
//         res.json(savedTodo);
//     } catch (error) {
//         res.status(500).json({ error: 'Error creating todo' });
//     }
// });

// app.put('/api/todos/:id', async (req, res) => {
//     try {
//         const todo = await Todo.findByIdAndUpdate(
//             req.params.id,
//             { completed: req.body.completed },
//             { new: true }
//         );
//         res.json(todo);
//     } catch (error) {
//         res.status(500).json({ error: 'Error updating todo' });
//     }
// });

// app.delete('/api/todos/:id', async (req, res) => {
//     try {
//         await Todo.findByIdAndDelete(req.params.id);
//         res.json({ message: 'Todo deleted' });
//     } catch (error) {
//         res.status(500).json({ error: 'Error deleting todo' });
//     }
// });

// Create Lambda handler
const server = awsServerlessExpress.createServer(app);

export const handler = (event, context) => {
    awsServerlessExpress.proxy(server, event, context);
};
