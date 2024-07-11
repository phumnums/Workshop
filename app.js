var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// const bodyParser = require('body-parser');

require('dotenv').config();
require('./db');

let base_url = '/api/v1'
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login')
var registerRouter = require('./routes/register')
var productsRouter = require('./routes/products');
var approveRouter = require('./routes/approve');
var orderRouter = require('./routes/orders');



const { count } = require('console');
const { default: mongoose } = require('mongoose');

var app = express();
var cors = require('cors')
app.use(cors())

// const mongoose = require('mongoose')
// const { DB_HOST, DB_PORT, DB_NAME } = process.env;
// var app = express();
// var cors = require('cors');
// app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


app.use(`${base_url}/`,indexRouter)
app.use(`${base_url}/users`,usersRouter)
app.use(`${base_url}/login`,loginRouter)
app.use(`${base_url}/register`,registerRouter)
app.use(`${base_url}/products`,productsRouter)
app.use(`${base_url}/approve`,approveRouter)
app.use(`${base_url}/orders`,orderRouter)

// app.use('/products', productsRouter)

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
