const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const users = []; 

router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    const userExists = users.find(u => u.username === username);
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = { username, password: hashedPassword };
    users.push(newUser);

    const token = jwt.sign({ username }, 'secretKey', { expiresIn: '1h' });

    res.cookie('token', token, {
        httpOnly: true, 
        secure: false,  
        maxAge: 90000, 
    });

    res.json({ message: 'User registered successfully' });
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username);
    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ username }, 'secretKey', { expiresIn: '1h' });

    res.cookie('token', token, {
        httpOnly: true, 
        secure: false,  
        maxAge: 3600000, 
    });

    res.json({ message: 'Logged in successfully' });
});

router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
});

module.exports = router;
