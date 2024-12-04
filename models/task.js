const db = require('../config/database.js')

const Task = {
    createTask: (task, callback) => {
        const query = 'INSERT INTO tasks (title, description, completed, user_id) VALUES (\'' + task.title + '\',\' ' + task.description + '\', ' + task.completed + ', ' + task.user_id + ' )';
        db.run(query, [], function (err) {
            callback(null, { id: this.lastID });
        });
    },
    
    getAllTaskByUserId: (userId, callback) => {
        const query = 'SELECT * FROM tasks WHERE user_id = ?';
        db.all(query, [userId], (err, rows) => {
            if (err) {
                console.error('Erreur lors de la récupération des tâches:', err.message);
                callback(err, null);
            } else {
                callback(null, rows);
            }
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
            callback(null, { id, ...task });
        });
    },

    deleteTask: (id, callback) => {
        const query = 'DELETE FROM tasks WHERE id = ?';
        db.run(query, [id], function (err) {
            if (err) {
                console.error('Erreur lors de la suppression de la tâche:', err.message);
                callback(err, null);
            } else if (this.changes === 0) {
                callback(new Error('Tâche non trouvée'), null);
            } else {
                callback(null, { id });
            }
        });
    }
};

module.exports = Task;
