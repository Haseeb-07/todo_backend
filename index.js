const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Task = require('./models/task');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;
const BASE_URL = process.env.BASE_URL;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.get('/', (req, res) => {
  res.send('API is running');
});

app.post('/tasks', async (req, res) => {
  try {
    const { title, description, dueDate, priority } = req.body;
    const task = new Task({
      title,
      description,
      dueDate,
      priority
    });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/tasks/:id', async (req, res) => {
  try {
    const taskId = req.params.id;
    await Task.findByIdAndDelete(taskId);
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});