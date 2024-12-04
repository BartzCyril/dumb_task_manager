
const express = require('express');
const router = express.Router();
const users = require('../models/user');
const bcrypt = require('bcrypt');

// Placeholder routes for authentication
router.get('/auth/login', (req, res) => res.render('login', { user: undefined }));
router.post('/auth/login', (req, res) => {
    users.authenticate(req.body.username, req.body.password, (err, user) => {
        if(err) {
            res.status(500).send(`Une erreur est survenue lors de la connexion ${err.message}`);
            return;
        }

        if (!user.connected) {
            res.status(400).send("Le nom d'utilisateur ou le mot de passe est incorrect");
            return;
        }
    })
})

router.post('/user/register', (req, res) => {
    const username = req.query.username;
    const password = req.query.password;
    const email = req.query.email;

    // Vérifie si les champs ne sont pas vides
    if(!username){
        res.status(400).send("Le champ 'username' est obligatoire");
        return;
    }

    if(!email){
        res.status(400).send("Le champ 'email' est obligatoire");
        return;
    }

    if(!password){
        res.status(400).send("Le champ 'password' est obligatoire");
        return;
    }

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#&@"'\[\]\{\}])[A-Za-z\d#&@"'\[\]\{\}]{8,}$/

    if(!regexEmail.test(email)) {
        res.status(400).send("Veuillez saisir une adresse mail dans le champ 'email'");
        return;
    }

    if(!regexPassword.test(password)) {
        res.status(400).send("Le mot de passe que vous avez saisir ne correspond pas au critière. Votre mot de passe doit contenir au moins 8 caractères, une lettre en minuscule et majucule, un nombre et un caractère spécial")
        return;
    }

    users.findUserByUsername(username , (err, user) => {
        if(user != undefined){
            res.status(400).send(`L'utilisateur ${username} existe déjà`);
            return;
        }

        users.findUserByEmail(email, (err, user) => {
            if(user != undefined){
                res.status(400).send(`L'adresse mail ${email} existe déjà`);
                return;
            }

            const hash = bcrypt.hashSync(password, 10)
            users.createUser({ username, hash, email }, (err, user) => {
                if (user) {
                    res.redirect('/login');
                } else {
                    res.redirect('/');
                }
            });
        });
    })
})
router.get('/auth/register', (req, res) => res.render('register',{ user: undefined }));

module.exports = router;
