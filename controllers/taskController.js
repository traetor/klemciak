const Task = require('../models/Task');

// Create a new task
exports.createTask = (req, res) => {
    const { title, description } = req.body;
    const user_id = req.user.id;

    if (!title) {
        return res.status(400).send({ message: 'Title is required' });
    }

    Task.create({ user_id, title, description, status: 'to_do' }, (err, result) => {
        if (err) {
            console.error('Error creating task:', err);
            return res.status(500).send(err);
        }
        res.status(201).send({ message: 'Task created successfully' });
    });
};

// Get tasks based on status or all tasks if no status provided
exports.getTasks = (req, res) => {
    const user_id = req.user.id;
    const { status } = req.query;

    if (!status) {
        Task.findByUserId(user_id, (err, tasks) => {
            if (err) return res.status(500).send(err);
            res.send(tasks);
        });
    } else {
        Task.findByStatusAndUserId(status, user_id, (err, tasks) => {
            if (err) return res.status(500).send(err);
            res.send(tasks);
        });
    }
};

// Update a task by ID
exports.updateTask = (req, res) => {
    const taskId = req.params.id;
    const { title, description, status } = req.body;
    const updatedFields = {};

    if (title) updatedFields.title = title;
    if (description) updatedFields.description = description;
    if (status) updatedFields.status = status;

    Task.update(taskId, updatedFields, (err, result) => {
        if (err) return res.status(500).send(err);
        res.send({ message: 'Task updated successfully' });
    });
};

// Delete a task by ID
exports.deleteTask = (req, res) => {
    const taskId = req.params.id;

    Task.delete(taskId, (err, result) => {
        if (err) return res.status(500).send(err);
        res.send({ message: 'Task deleted successfully' });
    });
};
