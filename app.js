var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var userAuth = require('./routes/userAuthentication');
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
app.use(require('express-session')({ secret: 'ThyZ is a big secret!: cat', resave: false, saveUninitialized: true, cookie: {expires:false} }));
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
require('./routes/passRecovery_route')(app);
require('./routes/annoucement_route')(app);
require('./routes/user_route')(app);
require('./routes/about_route')(app);

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    res.status(404);
    res.render('error',{err: err});
});


module.exports = app;
