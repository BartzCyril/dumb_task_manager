
const express = require('express');
const router = express.Router();
const users = require('../models/user');
const bcrypt = require('bcrypt');

// Placeholder routes for authentication
router.get('/login', (req, res) => res.render('login', { user: undefined }));
router.post('/login', (req, res) => {
    users.authenticate(req.body.username, req.body.password, (err, user) => {
        if(err) {
            res.status(500).send(`Une erreur est survenue lors de la connexion ${err.message}`);
            return;
        }

        if (user.connected) {
            res.redirect('/?userId=' + user.id)
        }
    })
})
router.get('/user/register', (req, res) => {
    const username = req.query.username;
    const password = req.query.password;
    const email = req.query.email;
    
    const hash = bcrypt.hashSync(password, 10)
    users.createUser({ username, hash, email }, (err, user) => {
        if(err){
            res.status(500).send(`Une erreur est survenue lors de l'enregistrement ${err.message}`);
            return;  
        }

        if (user) {
            res.redirect('/login');
        } else {
            res.redirect('/');
        }
    })
})
router.get('/register', (req, res) => res.render('register',{ user: undefined }));

module.exports = router;
