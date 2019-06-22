var express = require('express');
var router = express.Router();
var usersRouter = require('./users');

router.use('/users', usersRouter);

module.exports = router;
