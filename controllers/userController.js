const User = require('../models/User');
const fs = require('fs');
const path = require('path');

exports.getProfile = (req, res) => {
    const user_id = req.user.id;

    User.findById(user_id, (err, users) => {
        if (err) return res.status(500).send(err);
        if (users.length === 0) return res.status(404).send({ message: 'User not found' });

        const user = users[0];
        if (user.avatar) {
            const avatarPath = path.join(__dirname, '..', user.avatar);
            fs.readFile(avatarPath, (err, data) => {
                if (err) return res.status(500).send(err);
                const avatarBase64 = `data:image/jpeg;base64,${data.toString('base64')}`;
                user.avatar = avatarBase64;
                res.send(user);
            });
        } else {
            res.send(user);
        }
    });
};

exports.updateProfile = (req, res) => {
    const user_id = req.user.id;
    const { username } = req.body; // Remove email from destructuring
    let avatar = null;

    if (req.file) {
        avatar = `/uploads/avatars/${req.file.filename}`;

        User.findById(user_id, (err, users) => {
            if (err) return res.status(500).send(err);
            const oldAvatar = users[0].avatar;
            if (oldAvatar) {
                fs.unlink(path.join(__dirname, '..', oldAvatar), (err) => {
                    if (err) console.log(err);
                });
            }
        });
    }

    // Create an update object and conditionally include avatar
    const updateData = { username };
    if (avatar) {
        updateData.avatar = avatar;
    }

    User.update(user_id, updateData, (err, result) => {
        if (err) return res.status(500).send(err);

        // Find the updated user profile and send it back with avatar in base64 format
        User.findById(user_id, (err, users) => {
            if (err) return res.status(500).send(err);
            if (users.length === 0) return res.status(404).send({ message: 'User not found' });

            const user = users[0];
            if (user.avatar) {
                const avatarPath = path.join(__dirname, '..', user.avatar);
                fs.readFile(avatarPath, (err, data) => {
                    if (err) return res.status(500).send(err);
                    const avatarBase64 = `data:image/jpeg;base64,${data.toString('base64')}`;
                    user.avatar = avatarBase64;
                    res.send(user);
                });
            } else {
                res.send(user);
            }
        });
    });
};
