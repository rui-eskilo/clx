module.exports = function(app) 
{
	
	var express = require('express');
	var aboutRouter = express.Router();


	aboutRouter.get('/', function(req, res) 
	{
	  
	  res.render('about');
	});


	app.use("/about", aboutRouter);
}
