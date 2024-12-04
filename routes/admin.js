const express = require('express');
const router = express.Router();
const users = require('../models/user');


router.get('/', (req, res) => {
    users.getAllUsers((err, users) => {
        if(err){
            res.status(500).send(`Une erreur est survenue lors de la récupération des utilisateurs ${err.message}`);
            return;
        }
        res.render('admin', { users });
    })
})

module.exports = router;