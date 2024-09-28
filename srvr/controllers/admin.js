const User = require('../models/user'); // Capitalize Model names
const Task = require('../models/task'); // Capitalize Model names

// Create Task Controller
const createTask = async (req, res) => {
    try {
        const userId = req.params.id; // ID of assigned user
        const createdBy = req.user._id; // Get the user ID from middleware (decoded JWT)

        // Create the task
        const data = await Task.create({
            ...req.body, 
            assignedUser: userId, 
            createdBy
        });

        res.status(201).json({ success: true, data });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
}

// Get All Tasks (with pagination & filtering)
const getTasks = async (req, res) => {
    const { page = 1, limit = 10, status, priority } = req.query;
    const query = {};

    // Apply filtering
    if (status) query.status = status;
    if (priority) query.priority = priority;

    try {
        const tasks = await Task.find(query)
            .populate('assignedUser', 'name email') // Populate assigned user details
            .limit(limit * 1) // Pagination limit
            .skip((page - 1) * limit) // Skip for pagination
            .select('-__v'); // Exclude unnecessary fields

        const count = await Task.countDocuments(query); // Get total count of documents for pagination
        res.status(200).json({
            success: true,
            tasks,
            totalPages: Math.ceil(count / limit),
            currentPage: Number(page)
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
}

// Get Single Task by ID
const getTask = async (req, res) => {
    try {
        const taskId = req.params.id;
        const task = await Task.findById(taskId)
            .populate('assignedUser', 'name email'); // Populate user details

        if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

        res.status(200).json({ success: true, task });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
}

// Get Tasks by User
const getTaskByUser = async (req, res) => {
    try {
        const userId = req.params.id; // User ID from params
        const tasks = await Task.find({ assignedUser: userId })
            .populate('assignedUser', 'name email') // Populate user details
            .select('-__v'); // Exclude unnecessary fields

        res.status(200).json({ success: true, tasks });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
}

// Get All Users
const getUser = async (req, res) => {
    try {
        const users = await User.find()
            .select('-password -__v'); // Exclude sensitive information

        res.status(200).json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
}

module.exports = {
    createTask,
    getTasks,
    getTask,
    getTaskByUser,
    getUser
}
