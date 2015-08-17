//*****

// access to database model
var db = require('./db');
var ConnectRoles = require('connect-roles'); 

//access to utils modules
var utils = require("./utils.js");

// passport module configuration
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  function(username, password, done)
  {
    console.log("INFO: user has logged in.");
    db.User.getByUsername(username,function(err,user){
      if(err){return new Error(err);}
      if(!user || !user.isCorrectPassword(password)){
        return done(null,false, {message: "Utilizador ou Password inválido!"});
      } else {
        return done(null,user);
      }
      
    });
  }
  ));

passport.serializeUser(function(user, done) {
  done(null, user.username);
});

passport.deserializeUser(function(username, done) {
  console.log("deserializeUser");
  db.User.getByUsername(username, function(err, user)
  {
    if(err) return done(err);

    user.isAuthenticated = true;
    //user.roles.push("Editor"); // TODO, FIXME

    return done(null, user);
  });
});

var roles = new ConnectRoles({
  failureHandler: function (req, res, action) {
    // optional function to customise code that runs when
    // user fails authorisation
    var accept = req.headers.accept || '';
    res.status(403);
    if (~accept.indexOf('html')) {
      res.render('auth/access-denied', {action: action});
    } else {
      res.send('Access Denied - You don\'t have permission to: ' + action);
    }
  }
});





module.exports = function(app)
{

app.use(roles.middleware());

//anonymous users can only access the home page
//returning false stops any more rules from being
//considered
roles.use(function (req, action) {
  if (!req.isAuthenticated()) return action === 'access not authenticate';
})


//moderator users can access private page, but
//they might not be the only ones so we don't return
//false if the user isn't a moderator
roles.use('access editor', function (req) {
 if (req.user.role === 'editor') {
    return true;
  }
})

//admin users can access all pages
roles.use('access manager',function (req) {
  if (req.user.role === 'gestor') {
    return true;
  }
});


  app.use(function(req, res, next){
    res.locals.user = req.user || new db.User();
  res.locals.showPass = req.showPass || false;
    next();
  });

  app.get('/login', function (req, res) {
    return res.render('user/login', {message: utils.getMessages(req)});
  });


  app.post('/login', passport.authenticate('local', { successRedirect: '/',
    failureRedirect: '/login', 
    failureFlash: true}));




  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });
}

module.exports.roles = roles;