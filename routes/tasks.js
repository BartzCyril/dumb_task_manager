// @ts-nocheck

const express = require('express');
const router = express.Router();
const tasks = require('../models/task')

const authenticate = (req, res, next) => {
    if (req.query.userId) {
        next();
    } else {
        res.status(401).send('Unauthorized');
    }
};

router.get('/', (req, res) => {
    const userId = req.query.userId;
    tasks.getAllTaskByUserId(parseInt(userId), (err, data) => {
        res.render('dashboard', { data, userId })
    })
});

router.get('/remove', (req, res) => {
    const taskId = req.query.taskId;
    const userId = req.query.userId;
    if (userId) {
        tasks.deleteTask(taskId, () => {
            res.redirect(`/tasks?userId=${userId}`)
        })
    }

})

router.post('/', authenticate, (req, res) => {
    const { title, description, completed } = req.body;
    const userId = req.query.userId

    if(!title){
        res.status(400).send("Le champ 'task title' est obligatoire");
        return;
    }

    if(!description){
        res.status(400).send("Le champ 'task description' est obligatoire");
        return;
    }
    
    tasks.createTask({ user_id: userId, title, description, completed: 0 }, (err, task) => {
        if (task) {
            res.redirect(`/tasks?userId=${userId}`)
        }
    })
});

router.put('/:id', authenticate, (req, res) => {
    const { id } = req.params;
    const { title, description, completed } = req.body;
    const task = tasks.find((task) => task.id === parseInt(id));

    if (!task) {
        return res.status(404).send('Task not found');
    }

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (completed !== undefined) task.completed = completed;

    res.json(task);
});


module.exports = router;
