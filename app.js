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

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

let tasks = []; 
let taskId = 0; 

app.get('/', (req, res) => {
    const filterStatus = req.query.filterStatus || ''; // Ensure it's defined
    let filteredTasks = tasks; // Default to all tasks

    // If a filter is set, filter the tasks
    if (filterStatus) {
        filteredTasks = tasks.filter(task => task.status === filterStatus);
    }

    res.render('index', { tasks: filteredTasks, filterStatus: filterStatus }); // Pass filterStatus to EJS
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
    }
    res.redirect('/'); 
});

app.get('/filterTasks', (req, res) => {
    // This could be the same as the '/' route if you're just filtering
    // or you can handle it differently based on your needs.
    const filterStatus = req.query.filterStatus || '';
    let filteredTasks = tasks;

    if (filterStatus) {
        filteredTasks = tasks.filter(task => task.status === filterStatus);
    }

    res.render('index', { tasks: filteredTasks, filterStatus: filterStatus });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});