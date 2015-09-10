var db = require('./../db');
var generatePassword = require('password-generator');
var nodemailer = require("nodemailer");

module.exports = function(app){
  var express = require('express');
  var registerRouter = express.Router();

  registerRouter.get('/', function(req, res){
    res.locals.isvalid = false;
    return res.render('user/passRecovery');
  });

  registerRouter.post('/', function(req, res){
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
      res.locals.nPasss = user.password;
      res.locals.isvalid = true;
      var smtpTransport = nodemailer.createTransport("SMTP",{
        service: "Gmail",
        auth: {
          user: "clx9876@gmail.com",
          pass: "clx987654321"
        }
      });

      var mailOptions = {    from: "clx9876@gmail.com", // sender address 
        to: mail, // list of receivers 
        subject: "recover passord", // Subject line 
        text: user.password, // plaintext body 
        html: user.password // html body 
      };

      // send mail with defined transport object 
      smtpTransport.sendMail(mailOptions, function(error, response){
        if(error){
          console.log(error);
        }else{
          console.log("Message sent: " + response.message);
        }
      });
      return res.render('user/passRecovery');

    });

  });
});





 app.use("/recover", registerRouter);

}
