const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middlewares/auth');

const {createTask,getTask,getTasks,getTaskByUser} = require('../controllers/admin');

router.post('/task', protect, isAdmin, createTask);
router.get('/tasks', protect, isAdmin, getTasks);
router.get('/task/:id', protect, isAdmin, getTask);
router.get('/tasks/:id', protect, isAdmin, getTaskByUser);

module.exports = router;