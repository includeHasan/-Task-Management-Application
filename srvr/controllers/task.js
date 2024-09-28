const express = require('express');
const Task = require('../models/task');

// Create Task
const createTask = async (req, res) => {
    try {
        const userId = req.user._id;  // Get the user ID from decoded token in middleware
        const task = new Task({ ...req.body, user: userId });
        const data = await task.save();
        res.status(201).json({ success: true, data });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Get All Tasks
const getTasks = async (req, res) => {
    try {
        const userId = req.user._id;
        const tasks = await Task.find({ user: userId })
            .select('-__v')  // Exclude MongoDB internal fields if not needed
            .sort({ dueDate: -1 });  // Optional: Sort by due date
        res.status(200).json({ success: true, tasks });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Get Single Task by ID
const getTask = async (req, res) => {
    try {
        const userId = req.user._id;
        const task = await Task.findOne({ _id: req.params.id, user: userId });

        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }
        res.status(200).json({ success: true, task });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
}

// Update Task
const updateTask = async (req, res) => {
    try {
        const userId = req.user._id;
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, user: userId },
            req.body,
            { new: true }
        );

        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        res.status(200).json({ success: true, task });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
}

// Delete Task
const deleteTask = async (req, res) => {
    try {
        const userId = req.user._id;
        const task = await Task.findOneAndDelete({ _id: req.params.id, user: userId });

        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        res.status(200).json({ success: true, message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
}

module.exports = { createTask, getTasks, getTask, updateTask, deleteTask };
