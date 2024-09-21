const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const app = express();
const PORT = 3000;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Specify the directory for uploads
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Use timestamp to avoid name conflicts
    }
});

const upload = multer({ storage: storage });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

let tasks = []; 
let taskId = 0; // Initialize a task ID counter

app.get('/', (req, res) => {
    res.render('index', { tasks: tasks });
});

app.post('/add-task', upload.single('taskFile'), (req, res) => {
    const taskName = req.body.taskName;
    const taskStatus = req.body.taskStatus;
    const taskExpectedDate = req.body.taskExpectedDate;
    const taskFile = req.file ? req.file.filename : null; // Note: Handling file upload requires additional setup

    if (taskName) {
        // Create a new task object
        const newTask = {
            id: ++taskId, // Increment and assign ID
            name: taskName,
            status: taskStatus,
            expectedDate: taskExpectedDate,
            file: taskFile
        };
        tasks.push(newTask); // Add the new task object to the tasks array
    }
    res.redirect('/'); 
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});