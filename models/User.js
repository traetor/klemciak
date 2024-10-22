const pool = require('../config/db');

class User {
    static create(data, callback) {
        const sql = "INSERT INTO users (username, email, password, avatar, activation_token) VALUES ($1, $2, $3, $4, $5) RETURNING *";
        pool.query(sql, [data.username, data.email, data.password, data.avatar, data.activation_token], (err, res) => {
            if (err) {
                console.error('Error executing SQL:', err);
                return callback(err);
            }
            callback(null, res.rows[0]);
        });
    }

    static findByEmail(email, callback) {
        const sql = "SELECT * FROM users WHERE email = $1";
        pool.query(sql, [email], (err, res) => {
            if (err) return callback(err);
            callback(null, res.rows);
        });
    }

    // Dodajemy nową metodę w models/User.js
    static findByUsername(username, callback) {
        const sql = "SELECT * FROM users WHERE username = $1";
        pool.query(sql, [username], (err, res) => {
            if (err) return callback(err);
            callback(null, res.rows);
        });
    }

    static findById(id, callback) {
        const sql = "SELECT * FROM users WHERE id = $1";
        pool.query(sql, [id], (err, res) => {
            if (err) return callback(err);
            callback(null, res.rows);
        });
    }

    static update(id, data, callback) {
        const fields = [];
        const values = [];
        let fieldIndex = 1;

        if (data.username) {
            fields.push(`username = $${fieldIndex++}`);
            values.push(data.username);
        }
        if (data.avatar) {
            fields.push(`avatar = $${fieldIndex++}`);
            values.push(data.avatar);
        }

        const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = $${fieldIndex} RETURNING *`;
        values.push(id);

        pool.query(sql, values, (err, res) => {
            if (err) return callback(err);
            callback(null, res.rows[0]);
        });
    }

    static activate(token, callback) {
        const sql = "UPDATE users SET is_active = TRUE, activation_token = NULL WHERE activation_token = $1 RETURNING *";
        pool.query(sql, [token], (err, res) => {
            if (err) return callback(err);
            callback(null, res.rows[0]);
        });
    }

    static updateActivationToken(id, activationToken, callback) {
        const sql = "UPDATE users SET activation_token = $1 WHERE id = $2";
        pool.query(sql, [activationToken, id], (err, res) => {
            if (err) return callback(err);
            callback(null);
        });
    }

    static updateResetToken(id, resetToken, callback) {
        const sql = "UPDATE users SET reset_token = $1, reset_token_expiry = NOW() + INTERVAL '1 hour' WHERE id = $2";
        pool.query(sql, [resetToken, id], (err, res) => {
            if (err) return callback(err);
            callback(null);
        });
    }

    static resetPassword(token, newPassword, callback) {
        const sql = "UPDATE users SET password = $1, reset_token = NULL, reset_token_expiry = NULL WHERE reset_token = $2 AND reset_token_expiry > NOW() RETURNING *";
        pool.query(sql, [newPassword, token], (err, res) => {
            if (err) return callback(err);
            callback(null, res.rows[0]);
        });
    }
}

module.exports = User;
