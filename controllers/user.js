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

exports.getUsers = async (req, res, next) => {
    try {
        let findAllUsers = await User.find();
        findAllUsers = findAllUsers.map(e => {
            return {
                user_name: e.userName,
                account_number: e.accountNumber,
                email: e.emailAddress,
                identity_number: e.identityNumber
            }
        })
        return res.status(200).json({ data: findAllUsers })
    } catch (error) {
        return next(error);
    }
};

exports.getUserByAccountNumber = async (req, res, next) => {
    try {
        const findByAccountNumber = await User.findOne({ accountNumber: req.params.account_number });
        console.log(findByAccountNumber)

        if (!findByAccountNumber) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ data: {
            user_name: findByAccountNumber.userName,
            account_number: findByAccountNumber.accountNumber,
            email: findByAccountNumber.emailAddress,
            identity_number: findByAccountNumber.identityNumber
        }});
    } catch (error) {
        console.log('get-err', error);
        return next(error);
    }
};

exports.getUserByIdentityNumber = async (req, res, next) => {
    try {
        const findByIdentityNumber = await User.findOne({ identityNumber: req.params.identity_number });

        if (!findByIdentityNumber) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ data: {
            user_name: findByIdentityNumber.userName,
            account_number: findByIdentityNumber.accountNumber,
            email: findByIdentityNumber.emailAddress,
            identity_number: findByIdentityNumber.identityNumber
        }});
    } catch (error) {
        console.log('get-err', error);
        return next(error);
    }
};

exports.updateUser = async (req, res, next) => {
    try {
        let findUser = await User.findOne({ emailAddress: req.session.email });
        if (!findUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 12);
        findUser.password = hashedPassword
        console.log(findUser)
        await findUser.save();
        await redisClient.del(req.session.email) 

        return res.status(200).json({ message: 'User updated successfully' })
    } catch (error) {
        console.log('update-err', error);
        return next(error);
    }
};

exports.removeUser = async (req, res, next) => {
    try {
        let findUser = await User.findOne({ emailAddress: req.session.email });
        if (!findUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        await findUser.deleteOne({ emailAddress: req.session.email });
        await redisClient.del(req.session.email)

        return res.status(200).json({ message: 'User removed successfully' })
    } catch (error) {
        console.log('remove-err', error);
        return next(error);
    }
};

exports.signoutUser = async (req, res, next) => {
    try {
        
    } catch (error) {
        console.log('remove-err', error);
        return next(error);
    }
};
