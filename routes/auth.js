
const express = require('express');
const router = express.Router();
const users = require('../models/user');
const task = require('../models/task');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Placeholder routes for authentication
router.get('/login', (req, res) => {
    if(req.session.isLogged){
        res.redirect("/");
        return;
    }
    res.render('login', { session: req.session });
});

router.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const todos = req.body.todos;

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

        if (todos && Array.isArray(todos) && todos.length > 0) {
            task.massCreateTask(todos.map(todo => ({ ...todo, user_id: user.id })), (err, rows) => {
                console.log(err)
            });
        }

        if(user.is_admin == 1){
            user.is_admin = true;
        }
        else {
            user.is_admin = false;
        }

        const token = jwt.sign({
            exp: Math.floor(Date.now() / 1000) + (60 * 60),
            data: user.id
        }, process.env.TOKEN_SECRET);

        res.cookie('token', token, {
            maxAge: Math.floor(Date.now() / 1000) + (60 * 60)
        });

        req.session.userid = user.id;
        req.session.isLogged = true;
        req.session.isAdmin = user.is_admin;
        res.status(200).send({redirect: "/"});
    })
});

router.get('/register', (req, res) => {
    if(req.session.isLogged){
        res.redirect("/");
        return;
    }
    res.render('register', {session: req.session});
});

router.post('/register', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const confirmPassword = req.body.confirmPassword;
    
    console.log(username, password, email, confirmPassword);
    
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

    if(!confirmPassword){
        res.status(400).send({message: "Le champ 'confirmPassword' est obligatoire"});
        return;
    }


    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#&@*"'\[\]\{\}])[A-Za-z\d#&@*"'\[\]\{\}]{8,}$/
    
    console.log(regexEmail.test(email));
    
    if(!regexEmail.test(email)) {
        res.status(400).send({message : "Veuillez saisir une adresse mail dans le champ 'email'"});
        return;
    }
    
    console.log(regexPassword.test(password));

    if(!regexPassword.test(password)) {
        res.status(400).send({message : "Le mot de passe que vous avez saisir ne correspond pas au critière. Votre mot de passe doit contenir au moins 8 caractères, une lettre en minuscule et majucule, un nombre et un caractère spécial"})
        return;
    }
    
    console.log(password, confirmPassword);

    if (password !== confirmPassword) {
        res.status(400).send({message: "Les mots de passe ne correspondent pas"});
        return;
    }

    users.findUserByUsername(username , (err, user) => {
        console.log(err)
        if(user != undefined){
            res.status(400).send({message : `L'utilisateur ${username} existe déjà`});
            return;
        }

        users.findUserByEmail(email, (err, user) => {
            console.log(err)
            if(user != undefined){
                res.status(400).send({message : `L'adresse mail ${email} existe déjà`});
                return;
            }

            const hash = bcrypt.hashSync(password, 10)
            users.createUser({ username, hash, email }, (err, user) => {
                console.log(err)
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

router.get('/logout', (req, res) => {
    res.clearCookie('token');
    req.session.destroy();
    res.redirect("/");
});

module.exports = router;
