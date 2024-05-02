const express = require('express');
const userController = require('../controllers/user');
const errorHandlingMiddleware = require('../middlewares/error_handling');
const sessionMiddleware = require('../middlewares/session');
const router = express.Router();


router.post('/signup', userController.signupUser);
router.post('/signin', userController.signinUser);
router.get('/:account_number/account-number', [sessionMiddleware], userController.getUserByAccountNumber);
router.get('/:identity_number/identity-number', [sessionMiddleware], userController.getUserByIdentityNumber);
router.get('/', [sessionMiddleware], userController.getUsers);
router.put('/update-password', [sessionMiddleware], userController.updateUser);
router.delete('/remove', [sessionMiddleware], userController.removeUser);

router.use(errorHandlingMiddleware);

module.exports = router;
