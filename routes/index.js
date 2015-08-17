var express = require('express');
var annoucementDb = require('./../db/index');
var config = require(require('path').resolve(__dirname, "../", "config.js"));
var router = express.Router();
var db_comment = require('./../db/comment_db');

var maxAnnoucementsAtHomepage = config.getNbrAnnoucementsAtHomepage();

/* GET home page. */
router.get('/', function(req, res, next) {
	
	annoucementDb.Annoucement.getAllAnnoucements(function(err, allAnnoucement)
	{
		if(err) {
			console.log(err);
			next(err);
		}
			annoucementDb.Category.getAllCategories(function(err, allCategories){
        		
        		if(err) return res.status(500).send("OMG! Server Error.");
	    		
	    		var data = { 
							username: res.locals.user.username,
							annoucements: allAnnoucement.slice(0,maxAnnoucementsAtHomepage).filter(function(a) { return a._state == 'activo'}), 
							categories: allCategories,
							title: 'Annoucement'
		 
						};
		  		res.render('index', data);
			});
	});


});



router.get('/all', function(req, res, next) {
	annoucementDb.Annoucement.getAllAnnoucements(function(err, allAnnoucement)
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
