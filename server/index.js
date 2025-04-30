// app.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import todoRoutesV1 from './routes/v1/todos.js';
import todoRoutesV2 from './routes/v2/todos.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB URI
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/todoapp';

// Connect to MongoDB
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on('error', (err) => {
    console.error('Database connection error:', err);
});

mongoose.connection.once('open', async () => {
    console.log('Database connected successfully.');
    // await loadDefaultTasks();
});

// Load default tasks function
const loadDefaultTasks = async () => {
    const filePath = path.join(__dirname, 'default-tasks.json');
    try {
        const fileData = fs.readFileSync(filePath, 'utf8');
        const defaultTasks = JSON.parse(fileData);
        
        const Todo = mongoose.model('Todo'); // Avoid redefining model
        const existingTasks = await Todo.countDocuments();
        if (existingTasks === 0) {
            await Todo.insertMany(defaultTasks);
            console.log('Default tasks loaded into database.');
        }
    } catch (error) {
        console.error('Error loading default tasks:', error);
    }
};

// Use routes
app.use('/api/todos', todoRoutesV1);
app.use('/api/v2/todos', todoRoutesV2);

// Start server
if (process.env.NODE_ENV !== 'test') {
    const PORT = 3000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}