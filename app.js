var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressValidation = require('express-validation');
var UnauthorizedError = require('express-jwt').UnauthorizedError;

var indexRouter = require('./routes/index');

var authHandler = require('./helper/auth-handler');

var app = express();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE, PUT');
  res.header('Access-Control-Max-Age', '1000');
  next();
});

app.options('*', (req, res, next) => {
  res.sendStatus(200);
});

app.use(authHandler);

app.use('/', indexRouter);

//catch errors
// if error is not an instanceOf APIError, convert it.
app.use((err, req, res, next) => {
  if (err instanceof expressValidation.ValidationError) {
    // validation error contains errors which is an array of error each containing message[]
    const unifiedErrorMessage = err.errors.map(error => error.messages.join('. ')).join(' and ');
    const error = createError(401, unifiedErrorMessage);
    return next(error);
  } else if (err instanceof UnauthorizedError) {
    const apiError = createError(400, err.message);
    return next(apiError);
  }
  return next(err);
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = createError(404, 'API not found.');
  return next(err);
});

//send errors
app.use((err, req, res, next) => {
  console.log('Error', err);
  if (err.status) {
    res.status(err.status).json({
      message: err.message
    });
  } else {
    res.status(500).json({ message: 'Somthing went wrong' });
  }
});

module.exports = app;