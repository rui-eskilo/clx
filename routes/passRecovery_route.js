var db = require('./../db');
var generatePassword = require('password-generator');


module.exports = function(app) 
{
	var express = require('express');
	var registerRouter = express.Router();


 registerRouter.get('/', function(req, res) 
 {
  res.locals.isvalid = false;
  return res.render('user/passRecovery');
});




 registerRouter.post('/', function(req, res)
 {
   var mail = req.body.mail;
   db.User.getByMail(mail,function(err,user){
    if(err){return new Error(err);}
    if(!user) {
      console.log("mail não encontrado");
      res.locals.isvalid = false;
      return res.render('user/passRecovery');
    }
    

    user.password = generatePassword();

    db.User.changePassword(user, function (err, user) {
          //if(err) return res.status(500).send("OMG! Server Error.");
          res.locals.nPasss = user.password;
          res.locals.isvalid = true;
          return res.render('user/passRecovery');

        });


  });


 });


 app.use("/recover", registerRouter);

}
