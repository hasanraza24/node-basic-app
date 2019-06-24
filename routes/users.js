var express = require('express');
var router = express.Router();
var userCtlr = require('../controllers/user.controller');
var validate = require('express-validation');
var userValidation = require('../validations/user.validation');

router.post('/register', validate(userValidation.create), userCtlr.register);

router.post('/login', validate(userValidation.auth), userCtlr.login);

router.post('/forgot-pwd', validate(userValidation.frgPwd), userCtlr.forgotPwd);

router.post('/reset-password', validate(userValidation.auth), userCtlr.resetPassword);

module.exports = router
