const express = require('express');
const Todo = require('../models/Todo');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

// Get all todos for logged in user
router.get('/', auth, async (req, res) => {
  const todos = await Todo.find({ user: req.user }).sort({ createdAt: -1 });
  res.json(todos);
});

// Add new todo
router.post('/', auth, async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Text required' });

  const todo = new Todo({ text, user: req.user });
  await todo.save();
  res.status(201).json(todo);
});

// Update todo
router.put('/:id', auth, async (req, res) => {
  const todo = await Todo.findOneAndUpdate(
    { _id: req.params.id, user: req.user },
    req.body,
    { new: true }
  );
  if (!todo) return res.status(404).json({ error: 'Todo not found' });
  res.json(todo);
});

// Delete todo
router.delete('/:id', auth, async (req, res) => {
  const todo = await Todo.findOneAndDelete({ _id: req.params.id, user: req.user });
  if (!todo) return res.status(404).json({ error: 'Todo not found' });
  res.json({ success: true });
});

module.exports = router;
