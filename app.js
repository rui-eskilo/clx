var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var userAuth = require('./userAuthentication');
var nodeUuid = require('node-uuid');
var flash = require('connect-flash');  //var flash = require('req-flash');



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('express-session')({ secret: 'ThyZ is a big secret!: cat', resave: false, saveUninitialized: true, cookie: {maxAge:60000} }));
app.use(require('passport').initialize());
app.use(require('passport').session());
app.use(flash());

app.locals.title = "CLX";

app.use(function(req, res, next) {
  var reqUrl = req.url;
  res.locals.isActive = function(url) {
     return reqUrl == url;
 }
 next();
});


userAuth(app);

var routes = require('./routes/index');
//var how = require('./routes/how');
require('./routes/passRecovery_route')(app);
require('./routes/annoucement_route')(app);
require('./routes/user_route')(app);
require('./routes/about_route')(app);
require('./routes/dashboard_route')(app);


//app.use('/how', how);
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/*
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.log(11);
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    console.log(22);
    //res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

/*
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  //console.log(33);
  //res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
*/

module.exports = app;
