
const express = require('express');
const router = express.Router();
const users = require('../models/user');
const bcrypt = require('bcrypt');

// Placeholder routes for authentication
router.get('/auth/login', (req, res) => {
    if(req.session.isLogged){
        res.redirect("/");
        return;
    }
    res.render('login', { session: req.session });
});

router.post('/auth/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if(!username){
        res.status(400).send({message: "Le champ 'username' est obligatoire"});
        return;
    }

    if(!password){
        res.status(400).send({message: "Le champ 'password' est obligatoire"});
        return;
    }

    users.authenticate(username, password, (err, user) => {
        if(err) {
            res.status(500).send({message: `Une erreur est survenue lors de la connexion ${err.message}`});
            return;
        }

        if (!user.connected) {
            res.status(400).send({message: "Le nom d'utilisateur ou le mot de passe est incorrect"});
            return;
        }

        req.session.userid = user.id;
        req.session.isLogged = true;
        res.status(200).send({redirect: "/"});
    })
});

router.get('/auth/register', (req, res) => {
    if(req.session.isLogged){
        res.redirect("/");
        return;
    }
    res.render('register', {session: req.session});
});

router.post('/auth/register', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;

    // Vérifie si les champs ne sont pas vides
    if(!username){
        res.status(400).send({message: "Le champ 'username' est obligatoire"});
        return;
    }

    if(!email){
        res.status(400).send({message: "Le champ 'email' est obligatoire"});
        return;
    }

    if(!password){
        res.status(400).send({message: "Le champ 'password' est obligatoire"});
        return;
    }

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#&@*"'\[\]\{\}])[A-Za-z\d#&@*"'\[\]\{\}]{8,}$/

    if(!regexEmail.test(email)) {
        res.status(400).send({message : "Veuillez saisir une adresse mail dans le champ 'email'"});
        return;
    }

    if(!regexPassword.test(password)) {
        res.status(400).send({message : "Le mot de passe que vous avez saisir ne correspond pas au critière. Votre mot de passe doit contenir au moins 8 caractères, une lettre en minuscule et majucule, un nombre et un caractère spécial"})
        return;
    }

    users.findUserByUsername(username , (err, user) => {
        if(user != undefined){
            res.status(400).send({message : `L'utilisateur ${username} existe déjà`});
            return;
        }

        users.findUserByEmail(email, (err, user) => {
            if(user != undefined){
                res.status(400).send({message : `L'adresse mail ${email} existe déjà`});
                return;
            }

            const hash = bcrypt.hashSync(password, 10)
            users.createUser({ username, hash, email }, (err, user) => {
                console.log(err, user)
                if (err) {
                    res.status(500).send({message: `Une erreur est survenue lors de la création de l'utilisateur ${err.message}`});
                    return;
                }
                if (user) {
                    res.status(200).send({redirect: "/auth/login"});
                } else {
                    res.status(500).send({message: `Une erreur est survenue lors de la création de l'utilisateur`});
                }
            });
        });
    })
});

router.get('/auth/logout', (req, res) => {
    req.session.destroy();
    res.redirect("/");
});

module.exports = router;
