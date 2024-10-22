const pool = require('../config/db');

class Note {
    static create(data, callback) {
        const sql = "INSERT INTO notes (title, content, status, user_id) VALUES ($1, $2, $3, $4) RETURNING *";
        pool.query(sql, [data.title, data.content, data.status, data.user_id], (err, res) => {
            if (err) {
                console.error('Error executing SQL:', err);
                return callback(err);
            }
            callback(null, res.rows[0]);
        });
    }

    static findByUser(userId, callback) {
        const sql = "SELECT * FROM notes WHERE user_id = $1";
        pool.query(sql, [userId], (err, res) => {
            if (err) return callback(err);
            callback(null, res.rows);
        });
    }

    static update(id, data, callback) {
        const fields = [];
        const values = [];
        let fieldIndex = 1;

        if (data.title) {
            fields.push(`title = $${fieldIndex++}`);
            values.push(data.title);
        }
        if (data.content) {
            fields.push(`content = $${fieldIndex++}`);
            values.push(data.content);
        }
        if (data.status) {
            fields.push(`status = $${fieldIndex++}`);
            values.push(data.status);
        }

        const sql = `UPDATE notes SET ${fields.join(', ')} WHERE id = $${fieldIndex} RETURNING *`;
        values.push(id);

        pool.query(sql, values, (err, res) => {
            if (err) return callback(err);
            callback(null, res.rows[0]);
        });
    }

    static delete(id, callback) {
        const sql = "DELETE FROM notes WHERE id = $1";
        pool.query(sql, [id], (err, res) => {
            if (err) return callback(err);
            callback(null, res.rowCount > 0);
        });
    }
}

module.exports = Note;
