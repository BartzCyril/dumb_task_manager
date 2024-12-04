
const express = require('express');
const router = express.Router();
const users = require('../models/user')

// Placeholder routes for authentication
router.get('/login', (req, res) => res.render('login'));
router.post('/login', (req, res) => {
    users.authenticate(req.body.username, req.body.password, (user) => {
        if (!user.connected) {
            res.status(400).send("Le nom d'utilisateur ou le mot de passe est incorrect");
            return;
        }
        res.redirect('/?userId=' + user.id)
    })
})
router.get('/user/register', (req, res) => {
    let username = req.query.username;
    var password = req.query.password;
    let email = req.query.email;

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

    users.findByUsername(username , (err, user) => {
        if(user != undefined){
            res.status(400).send(`L'utilisateur ${username} existe déjà`);
            return;
        }

        users.findByEmail(email, (err, user) => {
            if(user != undefined){
                res.status(400).send(`L'adresse mail ${email} existe déjà`);
                return;
            }

            users.create({ username, password, email }, (err, user) => {
                if (user) {
                    res.redirect('/login');
                } else {
                    res.redirect('/');
                }
            });
        });
    })
})
router.get('/register', (req, res) => res.render('register'));

module.exports = router;
