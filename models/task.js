const db = require('../config/database.js')

const Task = {
    createTask: (task, callback) => {
        const query = 'INSERT INTO tasks (title, description, completed, user_id) VALUES (?, ?, ?, ?)';
        const params = [task.title, task.description, task.completed, task.user_id]
        db.run(query, params, function (err) {
            callback(err, { id: this.lastID });
        });
    },
    
    getAllTaskByUserId: (userId, callback) => {
        const query = 'SELECT * FROM tasks WHERE user_id = ?';
        db.all(query, [userId], (err, rows) => {
            callback(err, rows);
        });
    },

    updateTask: (id, task, callback) => {
        const query = `
            UPDATE tasks
            SET title = ?, description = ?, completed = ?
            WHERE id = ?
        `;
        const params = [task.title, task.description, task.completed, id];
        db.run(query, params, function (err) {
            callback(err, { id, ...task });
        });
    },

    deleteTask: (id, callback) => {
        const query = 'DELETE FROM tasks WHERE id = ?';
        db.run(query, [id], function (err) {
            if (this.changes === 0) {
                callback(new Error('Tâche non trouvée'), null);
            } else {
                callback(err, { id });
            }
        });
    }
};

module.exports = Task;
