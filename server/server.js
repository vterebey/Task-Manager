const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken'); 
const taskRoutes = require('./routes/tasks'); 
const authRoutes = require('./routes/auth');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 3000;

const corsOptions = {
    origin: 'http://localhost:3001', 
    credentials: true, 
};
app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(__dirname + '/public'));
app.use('/uploads', express.static('uploads'));
app.use(express.json());

const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    console.log('Token from cookies:', token);
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    try {
        const decoded = jwt.verify(token, 'secretKey'); 
        console.log('Decoded JWT:', decoded); 
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Invalid token:', error);
        res.status(401).json({ message: 'Invalid token' });
    }
};


app.use('/auth', authRoutes);

app.use('/task', verifyToken, taskRoutes);

app.use((req, res) => {
    res.status(404).send('Page not found');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
