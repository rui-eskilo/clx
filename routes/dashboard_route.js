var db = require('./../db');

var utils = require(require('path').resolve(__dirname, "../", "utils.js"));
var user = require('./../userAuthentication.js').roles;

module.exports = function(app) 
{

	var express = require('express');
	var dashboardRouter = express.Router();

	app.get('/',function(req, res, next){
	
		db.User.getByUsername(res.locals.user.username, function(err, user){
			if(err) req.flash('error','Erro a obter atividades dos anúncios.');
			if(user){
				res.locals.activity = user.votes_somatory / user.votes_users;
			}
		});
		next();
	});

	/* GET Followup listing. */
	dashboardRouter.get('/', function(req, res) 
	{
		if(!req.isAuthenticated()){
            res.render('user/access-denied', {action: "Need To Be Authenticated"});
        }

		db.Favorite.getAllFavoritesByUsername(res.locals.user.username, function(err, allFavorites)
		{
			if(err) req.flash('error','Erro a obter atividades dos anúncios.');

			var annoucements = [];
			if(allFavorites.length > 0){
				allFavorites.forEach(function(elem, index){
					db.Annoucement.getById(elem.annouce_id, function(err, annoucement){ 

						
						annoucements.push(annoucement); 
						
						if(index == allFavorites.length-1){
							var model = { title: 'CLX',
							message: utils.getMessages(req),
							annoucements: annoucements};
							res.render('dashboard/list', model );
						}
					});
				});
			} else {
				var model = { title: 'CLX',
							message: utils.getMessages(req),
							annoucements: []};
				res.render('dashboard/list', model );
			}
		});

	});

	app.use("/dashboard", dashboardRouter);
}