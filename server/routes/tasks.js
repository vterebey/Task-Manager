const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Настройка multer для загрузки файлов
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

let tasks = [];
let taskId = 0;

router.get('/', (req, res) => {
    const filterStatus = req.query.filterStatus || '';
    let filteredTasks = tasks;

    if (filterStatus) {
        filteredTasks = tasks.filter(task => task.status === filterStatus);
    }

    res.json(filteredTasks);
});

router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const task = tasks.find(t => t.id === id);

    if (task) {
        res.json(task);
    } else {
        res.status(404).send('Task not found');
    }
});

router.post('/', upload.single('taskFile'), (req, res) => {
    const { taskName, taskStatus, taskExpectedDate } = req.body;
    const taskFile = req.file ? req.file.filename : null;

    if (taskName) {
        const newTask = {
            id: ++taskId,
            name: taskName,
            status: taskStatus,
            expectedDate: taskExpectedDate,
            file: taskFile,
            user: req.user.username, 
        };
        tasks.push(newTask);
        res.status(201).json(newTask);
    } else {
        res.status(400).json({ message: 'Task name is required' });
    }
});

router.put('/:id', upload.single('taskFile'), (req, res) => {
    const id = parseInt(req.params.id, 10);
    const taskIndex = tasks.findIndex(t => t.id === id);

    if (taskIndex !== -1) {
        const { taskName, taskStatus, taskExpectedDate } = req.body;
        const taskFile = req.file ? req.file.filename : tasks[taskIndex].file;

        tasks[taskIndex] = {
            ...tasks[taskIndex],
            name: taskName || tasks[taskIndex].name,
            status: taskStatus || tasks[taskIndex].status,
            expectedDate: taskExpectedDate || tasks[taskIndex].expectedDate,
            file: taskFile,
        };
        res.json(tasks[taskIndex]);
    } else {
        res.status(404).send('Task not found');
    }
});

// Удаление задачи
router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const taskIndex = tasks.findIndex(t => t.id === id); 

    if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
        return res.status(204).send(); 
    } else {
        return res.status(404).json({ message: 'Task not found' });
    }
});

module.exports = router;
