var db = require('./../db');

module.exports = function(app) 
{
	
	var express = require('express');
	var registerRouter = express.Router();
    var loginRouter = express.Router();
    var voteRouter = express.Router();



	registerRouter.get('/', function(req, res) 
	{
		db.User.getAllUsers(function(err, users)
		{
			if(err) return res.status(500).send("Inacarditável! Server Error.");

			var model = { title: 'CLX',
			users: users,
            session : db.Session.createNew_UN()};
            //message: req.flash('warning')};
			res.render('user/new', model );
		});

	});

    registerRouter.post('/', function createNew(req, res)
    {

        var username = req.body.username;
        var password = req.body.password;
        var name = req.body.name;
        var mail = req.body.mail;
        
         var user = new db.User(username, password, name, mail);

        if(username == "" || password == "" || name == "") {
            
           // req.flash("warning", "Não é possível criar o user. Altere os valores e tente novamente.")
           return res.render('user/new', { user: db.User });
        }

        db.User.createNew(user, function (err, id) {
             if(err) {
                 //req.flash("warning", "Não é possível criar o user. Altere os valores e tente novamente.")
                return res.render('user/new', { user: db.User });
            }
            res.redirect('/register');
         });
    });

	app.use("/register", registerRouter);






    loginRouter.get('/', function(req,res){
        res.render('user/login', {session : db.Session.createNew_UN()});
    });

    app.use('/login',loginRouter);






    /* POST User detail. (voting) */
    voteRouter.post('/:username/vote', function(req, res) 
    {
        var rating = req.body.value_voted;
        
        db.User.getByUsername(req.param("username"), function(err, user)
        {
            if(err) req.flash('error','Não foi possível obter o utilizador.');
        
            user.votes_somatory += Number(rating);
            user.votes_users += 1;

            db.User.updateRating(user, function(err){
console.log(">>>>>>>>>>>>>>>>> à espera "+err);
                if(err){ req.flash('error','Não foi possível atualizar a classificação do vendedor.');
                }else{

                    req.flash('info','Classificação do vendedor atualizada com sucesso.');
                    res.redirect('/annoucement/view/'+req.query.annoucementID);  
                }
            }); 

        });
    });

    app.use('/user',voteRouter);
}