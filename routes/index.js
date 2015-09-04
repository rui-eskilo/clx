var express = require('express');
var db = require('./../db/index');
var config = require(require('path').resolve(__dirname, "../", "config.js"));
var utils = require(require('path').resolve(__dirname, "../", "utils.js"));
var router = express.Router();
var nCharForTitle = 20;
var nCharForDescription = 64;

var maxAnnoucementsAtHomepage = config.getNbrAnnoucementsAtHomepage();

/* GET home page. */
router.get('/', function(req, res, next) {
	
	db.Annoucement.getAllAnnoucements(function(err, allAnnoucement)
	{
		if(err) {
			console.log(err);
			next(err);
		}
			db.Category.getAllCategories(function(err, allCategories){
        		
        		if(err) return res.status(500).send("OMG! Server Error.");

        		db.Followup.getAllFollowupByUser(res.locals.user.username, function(err, elems){

					if(err) return res.status(500).send("Erro a carregar os Favoritos!");

					var ads = allAnnoucement.slice(0,maxAnnoucementsAtHomepage).filter(function(a) { return a._state == 'activo'});

					ads.forEach(function(e){
						e.title = utils.arrangeString(e.title , nCharForTitle);
						e.description = utils.arrangeString(e.description , nCharForDescription);});

	    		var data = { 
							username: res.locals.user.username,
							annoucements: ads,
							categories: allCategories,
							newActivity: elems.filter(function(e) { return e.activity == true}).length > 0 ? true : false,   // aqui está só a devolver true se houver anuncios na lista.
							title: 'Annoucement'
		 
						};
		  		res.render('index', data);


        		}  );
	    		

			});
	});


});



router.get('/all', function(req, res, next) {
	db.Annoucement.getAllAnnoucements(function(err, allAnnoucement)
	{
		if(err) {
			console.log(err);
			next(err);
		}

		console.log(allAnnoucement);

		var data = { annoucements: allAnnoucement, title: 'All Annoucements' };
		console.log(data);
  		res.render('list', data);
	});
});


router.get('/filter', function(req, res, next) {
  res.render('item');
  //next();
});

module.exports = router;
