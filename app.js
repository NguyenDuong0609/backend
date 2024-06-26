var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

const db = require('./config/db');

var usersRouter = require('./routes/admin/users');
const categoryRouter = require('./routes/admin/category');
const blogRouter = require('./routes/admin/blog');
const blogClientRouter = require('./routes/blog');
const categoryClientRouter = require('./routes/category');
const portFolioRouter = require('./routes/portfolio');

// Setup mongodb
const connectDatabase = require('./config/db');
const env = require('dotenv').config();

const errorMiddleware = require('./middlewares/errors');
const errorHandler = require('./utils/errorHandler');
const passport = require('passport');

// Connecting to database
connectDatabase();

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Middleware to handle errors
app.use(errorMiddleware);
app.use(errorHandler);
app.use(logger('dev'));
app.use(express.json());
app.use(passport.initialize());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Import all routes
// app.use('/', indexRouter);
app.use('/api/v1/admin', usersRouter);
app.use('/api/v1/admin', categoryRouter);
app.use('/api/v1/admin', blogRouter);
app.use('/api/v1/client', blogClientRouter);
app.use('/api/v1/client', categoryClientRouter);
app.use('/api/v1/portfolio', portFolioRouter);
// app.use('/api/v1', auth);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
