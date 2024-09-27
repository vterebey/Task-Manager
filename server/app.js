const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const app = express();
const PORT = 3000;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });
const cors = require('cors');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use('/uploads', express.static('uploads'));

let tasks = [];
let taskId = 0;

app.get('/tasks', (req, res) => {
    const filterStatus = req.query.filterStatus || '';
    let filteredTasks = tasks;

    if (filterStatus) {
        filteredTasks = tasks.filter(task => task.status === filterStatus);
    }

    res.json(filteredTasks);
});

app.get('/task/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const task = tasks.find(t => t.id === id);

    if (task) {
        res.json(task);
    } else {
        res.status(404).send('Task not found');
    }
});

app.post('/add-task', upload.single('taskFile'), (req, res) => {
    const taskName = req.body.taskName;
    const taskStatus = req.body.taskStatus;
    const taskExpectedDate = req.body.taskExpectedDate;
    const taskFile = req.file ? req.file.filename : null;

    if (taskName) {
        const newTask = {
            id: ++taskId,
            name: taskName,
            status: taskStatus,
            expectedDate: taskExpectedDate,
            file: taskFile
        };
        tasks.push(newTask);
        res.status(201).json(newTask);
    }
});

app.put('/update-task/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const taskIndex = tasks.findIndex(t => t.id === id);

    if (taskIndex !== -1) {
        tasks[taskIndex] = { ...tasks[taskIndex], ...req.body };
        res.json(tasks[taskIndex]);
    } else {
        res.status(404).send('Task not found');
    }
});

app.delete('/delete-task/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const taskIndex = tasks.findIndex(t => t.id === id); 

    if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1)
        return res.status(204).send(); 
    } else {
        return res.status(404).json({ message: 'Task not found' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
