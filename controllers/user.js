const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const redisClient  = require('../middlewares/redis_connect');
const User = require('../models/user');

exports.signupUser = async (req, res, next) => {
    try {
        const findUser = await User.findOne({ emailAddress: req.body.email });
        if (findUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        
        const hashedPassword = await bcrypt.hash(req.body.password, 12);
        const user = new User({
            emailAddress: req.body.email,
            password: hashedPassword,
            userName: req.body.username,
            accountNumber: Math.floor(Math.random() * 900000) + 100000,
            identityNumber: req.body.identity_number
        })
        await user.save();

        return res.status(201).json({ message: 'User created successfully'})
    } catch (error) {
        return next(error);
    }
};

exports.signinUser = async (req, res, next) => {
    try {
        const findUser = await User.findOne({ emailAddress: req.body.email });
        if (!findUser) {
            return res.status(400).json({ message: 'Please input the correct email or password' });
        }
        const comparePassword = await bcrypt.compare(req.body.password, findUser.password);
        if(!comparePassword) {
            return res.status(400).json({ message: 'Please input the correct email or password' });
        }

        const payloadJwt = {
            id: findUser._id.toString(),
            email: findUser.emailAddress,
            username: findUser.userName,
            identity_number: findUser.identityNumber
        }

        await redisClient.set(findUser.emailAddress,  JSON.stringify(payloadJwt), { EX: (60 * 60 * 1)})
        const accessToken = jwt.sign(payloadJwt, process.env.JWT_SECRET_KEY, { expiresIn: '1h'});

        return res.status(200).json({ data: { token: accessToken }})
    } catch (error) {
        console.log('signin-err', error);
        return next(error);
    }
};
