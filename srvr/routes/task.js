const express = require('express');
const router = express.Router();

const { createTask, getTasks, getTask, updateTask, deleteTask } = require('../controllers/task');
const { protect } = require('../middlewares/auth');


router.post('/task',protect, createTask);
router.get('/tasks', protect,getTasks);
router.get('/task/:id',protect, getTask);
router.put('/task/:id', protect,updateTask);
router.delete('/task/:id',protect, deleteTask);

module.exports = router;