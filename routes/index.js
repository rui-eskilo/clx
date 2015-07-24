var express = require('express');
var annoucementDb = require('./../model/annoucement');
var router = express.Router();



router.get('/all', function(req, res, next) {
	annoucementDb.getAllAnnoucement(5, function(err, allAnnoucement)
	{
		if(err) {
			console.log(err);
			next(err);
		}

		var data = { annoucements: allAnnoucement, title: 'Anuncios' };
  		res.render('list', data);
	});
});

router.get('/new', function(req, res, next) {
	res.render('new');
});

router.post('/new', function(req, res, next) {
	var title = req.body.title;
	var description = req.body.description;
	var price = req.body.price;
	var owner = req.body.owner;
	var category = req.body.category;
	var locate = req.body.locate;

	//validar se validamos aqui
	if(!title || !description || !owner || !category || !locate) return res.status(400).send("Dados invalidos");


	console.log("precinho "+ price);
	var annouce = new annoucementDb.Annoucement(null, title, description, price, null, owner, category, locate, "true");
	console.log(annouce);
  	annoucementDb.createAnnoucement(annouce, function(err, id)
  	{
  		console.log("slb3");
  		console.log(id);
  		if(err) return next(err);
  		var redirect = '/' + id;
  		return res.redirect(redirect);
  	});
});


router.get('/filter', function(req, res, next) {
  res.render('filter');
  next();
});


router.get('/:id', function(req, res, next) {
	var id = req.params.id;
	console.log("vai sacar o anuncio n " + id);
	annoucementDb.getIdAnnoucement(id, function(err, annouce)
	{
		if(err) {
			console.log(err);
			next(err);
		}

		var data = { annoucement: annouce, title: 'Anuncio' };
  		res.render('item', data);
	});
});

/* GET home page. */
router.get('/', function(req, res, next) {
	
	annoucementDb.getAllAnnoucement(5, function(err, allAnnoucement)
	{
		if(err) {
			console.log(err);
			next(err);
		}


		var data = { annoucements: allAnnoucement, title: 'Annoucement' };
  		res.render('index', data);
	});


});

module.exports = router;
