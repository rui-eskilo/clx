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

		//console.log(allAnnoucement);

		var data = { annoucements: allAnnoucement, title: 'Anuncios' };
		//console.log(data);
  		res.render('list', data);
	});
});

router.get('/new', function(req, res, next) {
	res.render('new');
});

router.post('/new', function(req, res, next) {
	//console.log("slb");
	//console.log(req.body);
	var title = req.body.title;
	

	//console.log(title);
	var description = req.body.description;
	var owner = req.body.owner;
	var category = req.body.category;
	var locate = req.body.locate;

	//validar se validamos aqui
	if(!title || !description || !owner || !category || !locate) return res.status(400).send("Dados invalidos");


	//console.log("slb2");
	var annouce = new annoucementDb.Annoucement(null, title, description, owner, category, locate, "true");
  	annoucementDb.createAnnoucement(annouce, function(err, id)
  	{
  		console.log("slb3");
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

		//console.log(annoucement);

		var data = { annoucement: annouce, title: 'Anuncio' };
		//console.log(data);
  		res.render('item', data);
	});
});

/* GET home page. */
router.get('/', function(req, res, next) {
	//console.log(1);
	
	annoucementDb.getAllAnnoucement(5, function(err, allAnnoucement)
	{
		//console.log(2);
		if(err) {
			//res.status(500).send(JSON.stringify(err));
			console.log(err);
			next(err);
		}

		//console.log(allAnnoucement);

		var data = { annoucements: allAnnoucement, title: 'Annoucement' };
		//console.log(data);
  		res.render('index', data);
	});

  //next();
  
  /*
  var annTmp = ["Bom dia", "1 2 3"];
  var data = { annoucement: annTmp, title: 'Annoucement' };
  res.render('index', data);
  //res.render('index');
  */

});

module.exports = router;