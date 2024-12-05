const db = require('./database.js')

function seedDatabase() {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run('CREATE TABLE users (id INT, username TEXT, password TEXT, email TEXT)');
            db.run('INSERT INTO users (id, username, password, email) VALUES  (1, "user1", "$2b$10$hzw1pCfJL2hjakDvbQiDF.yzFvChm0R.XKGm5T/0BW7v5.yk3Lndi", "user1@example.com")')
            db.run('INSERT INTO users (id, username, password, email) VALUES  (2, "user2", "$2b$10$XLfS/bMt0IckfRg14csICek7LPHGrJov/Yde/f5Y7eTMlvfikIWhu", "user2@example.com")', 
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