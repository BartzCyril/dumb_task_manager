const db = require('../config/database.js')
const bcrypt = require('bcrypt');

const User = {
    create: (user, callback) => {
        const query = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)';
        const params = [user.username, user.hash, user.email];
        db.run(query, params, function (err) {
            callback(null, { id: this.lastID, ...user });
        });
    },

    getAll: (callback) => {
        db.all('SELECT * FROM users', [], (err, results) => {
            callback(results)
        })
    },

    findByUsername: (username, callback) => {
        console.log(username)
        const query = 'SELECT * FROM users WHERE username = ?';
        db.get(query, [username], (err, user) => {
            callback(err, user)
        });
    },


    findByEmail: (username, callback) => {
        const query = 'SELECT * FROM users WHERE email = ?';
        db.get(query, [username], (err, user) => {
            callback(err, user)
        });
    },

    authenticate: (username, password, callback) => {
        User.findByUsername(username, (err, user) => {
            console.log({ user, password })
            if (user != undefined && bcrypt.compareSync(password, user.password)) {
                user.connected = true;
                return callback(user)
            }
            else{
                user = {
                    connected: false
                };
                return callback(user)
            }
        });
    },

    // Récupération d'un utilisateur par ID
    findById: (id, callback) => {
        const query = 'SELECT * FROM users WHERE id = ' + id;
        db.get(query, [], (err, user) => {
            return user
        });
    }
};

module.exports = User;
