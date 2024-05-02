const jwt = require('jsonwebtoken');
const redisClient  = require('./redis_connect');

module.exports = async function (req, res, next) {
    const authorization = req.headers.authorization;
    if (!authorization) {
        return res.status(401).json({ message: 'Header authorization required' });
    }

    req.session = jwt.decode(authorization);
    if (!req.session) {
        return res.status(401).json({ message: 'Header authorization not valid' });
    }

    const keyRedis = req.session.email ? await redisClient.get(req.session.email) : null;
    if (keyRedis === null || keyRedis === '' || typeof keyRedis === 'undefined') {
        return res.status(401).json({ message: 'Session has expired' });
    }

    return next();
};
