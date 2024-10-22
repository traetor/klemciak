const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

exports.authMiddleware = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) return res.status(401).send({ message: 'No token provided' });

    jwt.verify(token.split(' ')[1], process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: 'Failed to authenticate token' });
        }

        req.user = decoded;
        next();
    });
};
