const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
        console.log('signup-err', error);
        return next(error);
    }
};
