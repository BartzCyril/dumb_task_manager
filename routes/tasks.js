// @ts-nocheck

const express = require('express');
const router = express.Router();
const tasks = require('../models/task')
const loggedMiddleware = require('../middlewares/logged');
const { checkValidityofTheToken } = require('../middlewares/token');

router.get('/', (req, res) => {
    const userId = req.session.userid;
    const token = req.cookies.token;  
    let verifyToken = false;
  
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if(!err){
            verifyToken = true;
        }
    })
  
    if (!userId || !verifyToken) {
        res.render('index', {todos: undefined, session: {isLogged: false}});
        return;
    }

    tasks.getAllTaskByUserId(parseInt(userId), (err, todos) => {
        if(err){
            res.status(500).send({message: `Une erreur est survenue lors de la récupération des tâches ${err.message}`});
            return;
        }
        res.render('index', { todos, session: req.session })
    });
});

router.delete('/:id', [loggedMiddleware, checkValidityofTheToken], (req, res) => {
    const id = req.params.id;

    tasks.getTaskById(id, (err, task) => {
        if(err){
            res.status(500).send({message :`Une erreur est survenue lors de la récupération de la tâche ${err.message}`});
            return;
        }
        if(!task){
            res.status(404).send({message: "La tâche n'existe pas"});
            return;
        }
    });

router.get('/remove', [loggedMiddleware, checkValidityofTheToken], (req, res) => {
    const taskId = req.query.taskId;
    const userId = req.query.userId;
    if (userId) {
        tasks.deleteTask(taskId, (err) => {
            if(err){
                res.status(500).send(`Une erreur est survenue lors de la suppression de la tâche ${err.message}`);
                return;
            }
            res.redirect(`/tasks?userId=${userId}`)
        })
    }

    tasks.deleteTask(id, (err) => {
        if(err){
            res.status(500).send({message :`Une erreur est survenue lors de la suppression de la tâche ${err.message}`});
            return;
        }
        res.status(204).send({message: "La tâche a bien été supprimée"});
    })
})

router.post('/', [loggedMiddleware, checkValidityofTheToken], (req, res) => {
    const { title, description, completed } = req.body;

    const userId = req.session.userid;

    if(!title){
        res.status(400).send({message: "Le champ 'task title' est obligatoire"});
        return;
    }

    if(!description){
        res.status(400).send({message: "Le champ 'task description' est obligatoire"});
        return;
    }
    
    tasks.createTask({ user_id: userId, title, description, completed: false }, (err) => {
        if (err) {
            res.status(500).send({message :`Une erreur est survenue lors de la création de la tâche ${err.message}`});
            return;
        }
        res.status(201).send({message: "La tâche a bien été créée"});
    })
});

router.put('/', [loggedMiddleware, checkValidityofTheToken], (req, res) => {
    const { id, title, description, completed } = req.body;

    tasks.getTaskById(parseInt(id), (err, task) => {
        if(err){
            res.status(500).send({message :`Une erreur est survenue lors de la récupération de la tâche ${err.message}`});
            return;
        }
        if(!task){
            res.status(404).send({message: "La tâche n'existe pas"});
            return;
        }
    });

    tasks.updateTask({id: parseInt(id), title, description, completed}, (err) => {
        if(err){
            res.status(500).send({message :`Une erreur est survenue lors de la modification de la tâche ${err.message}`});
            return;
        }
        res.status(204).send({message: "La tâche a bien été modifiée"});
    })
});

module.exports = router;
