//*****

// access to database model
var db = require('./../db');


//access to utils modules
var utils = require("./../utils.js");

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
  console.log("++++++++++++++++ serializeUser ++++++++++++++++++++:"+user.username);
  done(null, user.username);
});

passport.deserializeUser(function(username, done) {
  console.log("deserializeUser");
  db.User.getByUsername(username, function(err, user)
  {
    if(err) return done(err);
    console.log("------------------ deserializeUser ----------------:"+user.username);
    user.isAuthenticated = true;

    return done(null, user);
  });
});


module.exports = function(app)
{

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
