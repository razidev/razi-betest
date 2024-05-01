const express = require('express');
const userController = require('../controllers/user');
const errorHandlingMiddleware = require('../middlewares/error_handling');
const router = express.Router();


router.post('/signup', userController.signupUser)

router.use(errorHandlingMiddleware);

module.exports = router;
