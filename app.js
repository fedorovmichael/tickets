var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('partials', path.join(__dirname, 'views/partials'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/getShowsByType', index);
app.use('/getShowByID', index);
app.use('/getSearchShowByText', index);
app.use('/getShowByFilters', index);
app.use('/event/:id', index);
app.use('/comment/:id', index); 
app.use('/concert/:id?', index);
app.use('/theater/:id?', index);
app.use('/circus', index);
app.use('/humor', index);
app.use('/children', index);
app.use('/show', index);
app.use('/meetings', index);
app.use('/sport', index);
app.use('/cinema', index);
app.use('/exibitions', index);
app.use('/today', index);
app.use('/tomorrow', index);
app.use('/week', index);
app.use('/weekend', index);
app.use('/nextweekend', index);
app.use('/month', index);
app.use('/treemonth', index);
app.use('/superprice', index);
app.use('/discount', index);
app.use('/tour', index);
app.use('/about', index);
app.use('/posts', index);
app.use('/post_edit/:id', index);
app.use('/addSubscription', index);
app.use('/removeSubscription', index);
app.use('/users', users);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
