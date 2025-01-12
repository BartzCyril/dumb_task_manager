const express = require('express');
const router = express.Router();
const users = require('../models/user');
const loggedMiddleware = require('../middlewares/logged');
const adminMiddleware = require('../middlewares/admin');
const { checkValidityofTheToken } = require('../middlewares/token');

router.get('/', (req, res) => {
    //const userId = req.session.userid;

    users.getAllUsers((err, users) => {
        const dataUsers = [];
        if(err){
            res.status(500).send({message : `Une erreur est survenue lors de la récupération des utilisateurs ${err.message}`});
            return;
        }

        users.map((user) => {
            if(user.is_super_admin == 0){
                dataUsers.push({
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    is_admin: user.is_admin
                })
            }
        })

        res.status(200).send({data: dataUsers});
    })
})

router.delete('/:id', (req, res) => {
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
});

router.put('/', (req, res) => {
    const { id, username, email, is_admin} = req.body;

    users.findUserById(parseInt(id), (err, user) => {
        if(err){
            res.status(500).send({message: `Une erreur est survenue lors de la récupération de la tâche ${err.message}`});
            return;
        }
        if(!user){
            res.status(404).send({message: "L'utilisateur n'existe pas"});
            return;
        }
        else{
            users.updateUser({id: parseInt(id), username, email, is_admin}, (err) => {
                if(err){
                    res.status(500).send({message: `Une erreur est survenue lors de la modification de l'utilisateur ${err.message}`});
                    return;
                }
                res.status(204).send({message: "L'utilisateura bien été modifiée"});
            })
        }
    })
})

module.exports = router;
