const db = require('../config/database.js')
const bcrypt = require('bcrypt');

const User = {
    createUser: (user, callback) => {
        const query = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)';
        const params = [user.username, user.hash, user.email];
        db.run(query, params, function (err) {
            callback(err, { id: this.lastID, ...user });
        });
    },

    getAllUsers: (callback) => {
        db.all('SELECT * FROM users', [], (err, results) => {
            callback(err, results)
        })
    },

    findUserByUsername: (username, callback) => {
        const query = 'SELECT * FROM users WHERE username = ?';
        db.get(query, [username], (err, user) => {
            callback(err, user)
        });
    },

    authenticate: (username, password, callback) => {
        User.findUserByUsername(username, (err, user) => {
            if (bcrypt.compareSync(password, user.password)) {
                user.connected = true;
                return callback(err, user)
            }
        });
    }
};

module.exports = User;
