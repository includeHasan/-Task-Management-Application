const express = require('express');
const User = require('../models/user');
const router = express.Router();
const jwt = require('jsonwebtoken');




router.post('/register', async (req, res) => {
    try {
        const user = new User(req.body);
       const data= await user.save();
        
        res.status(201).json({success:true,data}); 
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials', success: false });
        }
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials', success: false });
        }
        const token = jwt.sign({ id: user._id   }, 'secret', { expiresIn: '1h' });
        res.header('x-auth-token', token).status(200).json({ message: 'Logged in successfully', success: true });
    
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}
);

module.exports = router;