const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = mongoose.model('User');

const router = express.Router();
const { validateBody, schemas, signInSchema, confirmPassword, editProfile } = require('../helpers/routeHelpers');
const UsersController = require('../controllers/userController');

router.route('/signup')
    .post(validateBody(schemas.authSchema), UsersController.signUp);


router.route('/signin')
    .post(UsersController.signIn);


router.route('/verify')
    .post(UsersController.verify);

module.exports = router;