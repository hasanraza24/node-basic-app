var User = require('../models/user.model');
var jwt = require('jsonwebtoken');
const config = require('../config/config');
var _ = require('lodash');

const register = async (req, res, next) => {
    try {
        const userObj = await User.create(req.body);
        const user = _.pick(userObj, ['email', '_id']);
        const tokenData = {
            email: user.email,
            _id: user._id
        };
        const token = await jwt.sign(tokenData, config.jwtSecret);
        res.json({ success: true, data: { user, token }, message: 'User Created'});
    }catch(e) {
        next(e);
    }
};

const login = async (req, res, next) => {
    try {
        const userObj = await User.login(req.body);
        const user = _.pick(userObj, ['email', '_id']);
        const tokenData = {
            email: user.email,
            _id: user._id
        };
        const token = await jwt.sign(tokenData, config.jwtSecret);
        res.json({ success: true, data: { user, token }, message: 'User Logged in!'});
    }catch(e) {
        next(e);
    }
}

const forgotPwd = async (req, res, next) => {
    try {
        await User.forgotPwd(req.body.email);
        res.json({ success: true, message: 'Password reset link has been sent to your email ' + req.body.email })
    }catch(e) {
        next(e);
    }
}

const resetPassword = async (req, res, next) => {
    try {
        await User.resetPassword(req.body);
        res.json({ success: true, message: 'Password Reset!' });
    }catch(e) {
        next(e);
    }
}

module.exports = {
    login,
    register,
    forgotPwd,
    resetPassword
}