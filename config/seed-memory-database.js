const db = require('./database.js')

function seedDatabase() {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run('CREATE TABLE users (id INT, username TEXT, password TEXT, email TEXT, is_admin BOOL)');
            db.run('INSERT INTO users (id, username, password, email, is_admin) VALUES (1, "admin", "$2b$10$DA7ohjIhQtxpuo1wlN5KvetPXArmr/VvwvpIqaKZdhoS.zhTMPkre", "admin@example.com", 1)')
            db.run('INSERT INTO users (id, username, password, email, is_admin) VALUES (2, "user1", "$2b$10$hzw1pCfJL2hjakDvbQiDF.yzFvChm0R.XKGm5T/0BW7v5.yk3Lndi", "user1@example.com", 0)')
            db.run('INSERT INTO users (id, username, password, email, is_admin) VALUES (3, "user2", "$2b$10$hzw1pCfJL2hjakDvbQiDF.yzFvChm0R.XKGm5T/0BW7v5.yk3Lndi", "user2@example.com", 0)', 
                (err) => {
                    if(err) {
                        reject(err)
                    }
                    else{
                        resolve();
                    }
                }
            );
        });
    })
}

module.exports = { seedDatabase }