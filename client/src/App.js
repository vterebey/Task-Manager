import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/styles.css';

const TaskManager = () => {
    const [taskName, setTaskName] = useState('');
    const [taskStatus, setTaskStatus] = useState('not started');
    const [taskExpectedDate, setTaskExpectedDate] = useState('');
    const [taskFile, setTaskFile] = useState(null);
    const [filterStatus, setFilterStatus] = useState('');
    const [tasks, setTasks] = useState([]);
    const [editTask, setEditTask] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const statuses = ['not started', 'in progress', ]
    useEffect(() => {
        fetchTasks();
    }, [filterStatus]);



    const fetchTasks = async () => {
        try {
            const response = await axios.get('http://localhost:3000/tasks', {
                params: { filterStatus },
            });
            setTasks(response.data);
        } catch (error) {
            console.error('Error receiving tasks:', error);
        }
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('taskName', taskName);
        formData.append('taskStatus', taskStatus);
        formData.append('taskExpectedDate', taskExpectedDate);
        if (taskFile) {
            formData.append('taskFile', taskFile);
        }

        try {
            await axios.post('http://localhost:3000/add-task', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            fetchTasks();
            setTaskName('');
            setTaskStatus('not started');
            setTaskExpectedDate('');
            setTaskFile(null);
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    const handleFilterTasks = (e) => {
        e.preventDefault();
        fetchTasks();
    };

    const handleEditTask = (task) => {
        setEditTask(task);
        setIsEditing(true);
    };

    const handleSaveTask = async (e) => {
        try {
            e.preventDefault();
            await axios.put(`http://localhost:3000/update-task/${editTask.id}`, editTask);
            fetchTasks();
            setIsEditing(false);
            setEditTask(null);
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const handleDeleteTask = async (task) => {
        try {
            await axios.delete(`http://localhost:3000/delete-task/${task.id}`, task);
            fetchTasks();
        } catch(error) {
            console.error('Error deleting task:', error);
        }
    }

    return (
        <div className="container">
            <h1>Task Manager</h1>

            <div className="task-input">
                <form onSubmit={handleAddTask}>
                    <input
                        type="text"
                        value={taskName}
                        onChange={(e) => setTaskName(e.target.value)}
                        placeholder="Enter a new task"
                        required
                    />
                    <select
                        value={taskStatus}
                        onChange={(e) => setTaskStatus(e.target.value)}
                        required
                    >
                        <option value="not started">Not Started</option>
                        <option value="in progress">In Progress</option>
                        <option value="done">Done</option>
                    </select>
                    <input
                        type="date"
                        min = "1970-01-01"
                        value={taskExpectedDate}
                        onChange={(e) => setTaskExpectedDate(e.target.value)}
                        
                    />
                    <label className="input-file">
                        <input
                            type="file"
                            onChange={(e) => setTaskFile(e.target.files[0])}
                        />
                        <span>Choose file</span>
                    </label>
                    <input type="submit" id="add-task" value="Add Task" />
                </form>
            </div>

            <div className="status-filter">
                <form onSubmit={handleFilterTasks}>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="">All Statuses</option>
                        <option value="not started">Not Started</option>
                        <option value="in progress">In Progress</option>
                        <option value="done">Done</option>
                    </select>
                </form>
            </div>

            <div className="tasks-list">
                {tasks.map((task) => (
                    <div className="task" key={task.id} onClick={() => handleEditTask(task)}>
                        <p className="task-title">Name: {task.name}</p>
                        <p>Status: {task.status}</p>
                        <p>Expected Date: {task.expectedDate}</p>
                        {task.file && (
                            <p>
                                File: <a href={`/uploads/${task.file}`}>{task.file}</a>
                            </p>
                        )}
                        <div className="delete-task"> 
                            <button onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteTask(task);           
                            }}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>

            {isEditing && (
                <div className="modal-overlay">
                    <div className="edit-window">
                        <form onSubmit={handleSaveTask}>
                            <h2>Edit Task</h2>
                            <input
                                type="text"
                                value={editTask.name}
                                onChange={(e) => setEditTask({ ...editTask, name: e.target.value })}
                            />
                            <select
                                value={editTask.status}
                                onChange={(e) => setEditTask({ ...editTask, status: e.target.value })}
                            >
                                <option value="not started">Not Started</option>
                                <option value="in progress">In Progress</option>
                                <option value="done">Done</option>
                            </select>
                            <input
                                type="date"
                                min = "1970-01-01"
                                value={editTask.expectedDate}
                                onChange={(e) => setEditTask({ ...editTask, expectedDate: e.target.value })}
                            />
                            <div class="edit-btns">
                                <input type="submit" id="add-task" value="Save" />
                                <button onClick={() => setIsEditing(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskManager;