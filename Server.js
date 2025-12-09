require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Allow requests from any origin (for frontend)
app.use(cors());
app.use(express.json());

// MongoDB connection
const mongoUri = "mongodb+srv://prajithsaraniki_db_user:wWtIaxz1y81i8vIi@cluster0.aavqbjt.mongodb.net/todo?retryWrites=true&w=majority";

mongoose.connect(mongoUri)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));


mongoose.connect(mongoUri)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Todo Schema
const todoSchema = new mongoose.Schema({
  text: { type: String, required: true },
});

const Todo = mongoose.model('Todo', todoSchema);

// Routes
app.get('/', (req, res) => res.send('<h1>Todo API Running</h1>'));

app.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/todos', async (req, res) => {
  if (!req.body.text) return res.status(400).json({ message: 'Text is required' });
  try {
    const newTodo = new Todo({ text: req.body.text });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put('/todos/:id', async (req, res) => {
  if (!req.body.text) return res.status(400).json({ message: 'Text is required' });
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    todo.text = req.body.text;
    await todo.save();
    res.json(todo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete('/todos/:id', async (req, res) => {
  try {
    const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
    if (!deletedTodo) return res.status(404).json({ message: 'Todo not found' });
    res.json({ message: 'Todo deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

