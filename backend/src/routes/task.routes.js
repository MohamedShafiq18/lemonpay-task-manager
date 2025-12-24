const router = require('express').Router();
const auth = require('../middleware/auth');
const Task = require('../models/Task');

router.use(auth);

router.get('/', async (req, res) => {
  const tasks = await Task.find({ userId: req.user.id });
  res.json(tasks);
});

router.post('/', async (req, res) => {
  const task = await Task.create({ ...req.body, userId: req.user.id });
  res.json(task);
});

router.put('/:id', async (req, res) => {
  await Task.findByIdAndUpdate(req.params.id, req.body);
  res.json({ message: 'Updated' });
});

router.delete('/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;
