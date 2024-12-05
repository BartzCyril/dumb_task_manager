const express = require('express');
const router = express.Router();
const users = require('../models/user');

router.get('/', (req, res) => {
    if(!req.session.isAdmin){
        res.redirect("/");
        return;
    }
    users.getAllUsers((err, users) => {
        if(err){
            res.status(500).send({message : `Une erreur est survenue lors de la récupération des utilisateurs ${err.message}`});
            return;
        }
        res.render('admin', { users, session: req.session });
    })
})

router.delete('/:id', (req, res) => {
    if(!req.session.isAdmin){
        res.redirect("/");
        return;
    }
    const id = req.params.id;

    if (!id) {
        res.status(400).send({message: 'Id is required'});
        return;
    }

    users.deleteUser(id, (err, result) => {
        if(err){
            res.status(500).send({message: `Une erreur est survenue lors de la suppression de l'utilisateur ${err.message}`});
            return;
        }
        res.status(200).send({message: `Utilisateur #${id} supprimé avec succès`});
    })
})

module.exports = router;