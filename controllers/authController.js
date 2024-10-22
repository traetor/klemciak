const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const axios = require('axios');

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Funkcja weryfikująca reCAPTCHA
const verifyRecaptcha = async (recaptchaToken) => {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`;

    try {
        const response = await axios.post(verificationUrl);
        return response.data.success;
    } catch (err) {
        console.error('Error verifying reCAPTCHA:', err);
        return false;
    }
};

exports.register = (req, res) => {
    const { username, email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send({ message: `Email and password are required` });
    }

    const activationToken = crypto.randomBytes(20).toString('hex');

    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            console.error('Error hashing password:', err);
            return res.status(500).send({ message: `Error during registration. Please try again later.` });
        }

        User.create({ username, email, password: hash, avatar: null, activation_token: activationToken }, (err, result) => {
            if (err) {
                console.error('Error creating user:', err);
                return res.status(500).send({ message: `Error during registration. Please try again later.` });
            }

            const activationLink = `${process.env.FRONTEND_URL}/activate/${activationToken}`;
            const mailOptions = {
                from: process.env.EMAIL,
                to: email,
                subject: 'Account Activation',
                html: `<p>Please click the following link to activate your account: <a href="${activationLink}">Activate</a></p>`,
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending activation email:', error);
                    return res.status(500).send({ message: `Error during registration. Please try again later.` });
                }

                res.status(201).send({ message: `User registered successfully. Please check your email to activate your account.` });
            });
        });
    });
};

exports.activate = (req, res) => {
    const { token } = req.params;

    User.activate(token, (err, user) => {
        if (err) {
            console.error('Error activating account:', err);
            return res.status(500).send({ message: `Error activating account. Please try again later.` });
        }
        if (!user) {
            return res.status(400).send({ message: `Invalid or expired activation token.` });
        }

        res.send({ message: `Account activated successfully. You can now log in.` });
    });
};

exports.login = async (req, res) => {
    const { email, password, recaptchaToken } = req.body;

    if (!email || !password || !recaptchaToken) {
        return res.status(400).send({ message: 'Email, password, and reCAPTCHA token are required' });
    }

    // const isRecaptchaValid = await verifyRecaptcha(recaptchaToken);
    // if (!isRecaptchaValid) {
       // return res.status(400).send({ message: 'Invalid reCAPTCHA. Please try again.' });
    // }

    User.findByEmail(email, (err, users) => {
        if (err) {
            console.error('Error finding user by email:', err);
            return res.status(500).send({ message: 'Error finding user. Please try again later.' });
        }
        if (users.length === 0) {
            return res.status(404).send({ message: 'User not found' });
        }

        const user = users[0];
        if (!user.is_active) {
            return res.status(403).send({ message: 'Account is not activated. Please check your email for activation link.' });
        }

        bcrypt.compare(password, user.password, (err, match) => {
            if (err) {
                console.error('Error comparing passwords:', err);
                return res.status(500).send({ message: 'Error comparing passwords. Please try again later.' });
            }
            if (!match) {
                return res.status(401).send({ message: 'Invalid credentials' });
            }

            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.send({ token });
        });
    });
};

exports.checkEmailAvailability = (req, res) => {
    const { email } = req.params;

    User.findByEmail(email, (err, users) => {
        if (err) {
            console.error('Error finding user by email:', err);
            return res.status(500).send({ message: `Error checking email availability` });
        }

        const available = users.length === 0;
        res.send({ available });
    });
};

exports.checkUsernameAvailability = (req, res) => {
    const { username } = req.params;

    User.findByUsername(username, (err, users) => {
        if (err) {
            console.error('Error finding user by username:', err);
            return res.status(500).send({ message: `Error checking username availability` });
        }

        const available = users.length === 0;
        res.send({ available });
    });
};

exports.resendActivationEmail = (req, res) => {
    const { email } = req.body;

    User.findByEmail(email, (err, users) => {
        if (err) {
            console.error('Error finding user by email:', err);
            return res.status(500).send({ message: 'Error finding user. Please try again later.' });
        }
        if (users.length === 0) {
            return res.status(404).send({ message: 'User not found' });
        }

        const user = users[0];
        if (user.is_active) {
            return res.status(400).send({ message: 'Account is already activated' });
        }

        const activationToken = crypto.randomBytes(20).toString('hex');
        User.updateActivationToken(user.id, activationToken, (err) => {
            if (err) {
                console.error('Error updating activation token:', err);
                return res.status(500).send({ message: 'Error during resend activation email. Please try again later.' });
            }

            const activationLink = `${process.env.FRONTEND_URL}/activate/${activationToken}`;
            const mailOptions = {
                from: process.env.EMAIL,
                to: email,
                subject: 'Account Activation',
                html: `<p>Please click the following link to activate your account: <a href="${activationLink}">Activate</a></p>`,
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending activation email:', error);
                    return res.status(500).send({ message: 'Error during resend activation email. Please try again later.' });
                }

                res.status(200).send({ message: 'Activation email resent successfully. Please check your email.' });
            });
        });
    });
};

exports.forgotPassword = (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).send({ message: 'Email is required' });
    }

    User.findByEmail(email, (err, users) => {
        if (err) {
            console.error('Error finding user by email:', err);
            return res.status(500).send({ message: 'Error finding user. Please try again later.' });
        }
        if (users.length === 0) {
            return res.status(404).send({ message: 'User not found' });
        }

        const user = users[0];
        const resetToken = crypto.randomBytes(20).toString('hex');

        User.updateResetToken(user.id, resetToken, (err) => {
            if (err) {
                console.error('Error updating reset token:', err);
                return res.status(500).send({ message: 'Error during password reset. Please try again later.' });
            }

            const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
            const mailOptions = {
                from: process.env.EMAIL,
                to: email,
                subject: 'Password Reset',
                html: `<p>Please click the following link to reset your password: <a href="${resetLink}">Reset Password</a></p>`,
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending password reset email:', error);
                    return res.status(500).send({ message: 'Error during password reset. Please try again later.' });
                }

                res.status(200).send({ message: 'Password reset email sent successfully. Please check your email.' });
            });
        });
    });
};

exports.resetPassword = (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
        return res.status(400).send({ message: 'Password is required' });
    }

    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            console.error('Error hashing password:', err);
            return res.status(500).send({ message: 'Error resetting password. Please try again later.' });
        }

        User.resetPassword(token, hash, (err, user) => {
            if (err) {
                console.error('Error resetting password:', err);
                return res.status(500).send({ message: 'Error resetting password. Please try again later.' });
            }
            if (!user) {
                return res.status(400).send({ message: 'Invalid or expired reset token.' });
            }

            res.send({ message: 'Password reset successfully. You can now log in with your new password.' });
        });
    });
};