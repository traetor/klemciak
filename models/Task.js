const pool = require('../config/db');

class Task {
    // Create a new task
    static create(data, callback) {
        const sql = "INSERT INTO tasks (user_id, title, description, status) VALUES ($1, $2, $3, $4) RETURNING *";
        pool.query(sql, [data.user_id, data.title, data.description, data.status], (err, res) => {
            if (err) return callback(err);
            callback(null, res.rows[0]);
        });
    }

    // Find tasks by user ID
    static findByUserId(user_id, callback) {
        const sql = "SELECT * FROM tasks WHERE user_id = $1";
        pool.query(sql, [user_id], (err, res) => {
            if (err) return callback(err);
            callback(null, res.rows);
        });
    }

    // Find tasks by status and user ID
    static findByStatusAndUserId(status, user_id, callback) {
        const sql = "SELECT * FROM tasks WHERE status = $1 AND user_id = $2";
        pool.query(sql, [status, user_id], (err, res) => {
            if (err) return callback(err);
            callback(null, res.rows);
        });
    }

    // Update a task by ID
    static update(id, data, callback) {
        const keys = Object.keys(data);
        const values = keys.map((key, index) => `$${index + 1}`);
        const sql = `UPDATE tasks SET ${keys.map((key, index) => `${key} = ${values[index]}`).join(', ')} WHERE id = $${keys.length + 1} RETURNING *`;
        const params = [...Object.values(data), id];

        pool.query(sql, params, (err, res) => {
            if (err) return callback(err);
            callback(null, res.rows[0]);
        });
    }

    // Delete a task by ID
    static delete(id, callback) {
        const sql = "DELETE FROM tasks WHERE id = $1";
        pool.query(sql, [id], (err, res) => {
            if (err) return callback(err);
            callback(null, res.rowCount);
        });
    }
}

module.exports = Task;