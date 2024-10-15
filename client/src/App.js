import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import TaskManager from './TaskManager';
import Login from './Login';
import Register from './Register';

const isAuthenticated = () => {
    return true
};

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/tasks" element={isAuthenticated() ? <TaskManager /> : <Navigate to="/login" />} />
                <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
};

export default App;
