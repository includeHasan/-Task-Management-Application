const express = require('express');
const router = express.Router();
const {registerUser,loginUser} = require('../controllers/user'); // Import the functions from user.js controller file
    l

router.post('/register',registerUser);

router.post('/login',loginUser);

module.exports = router;