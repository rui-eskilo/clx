var pg = require('pg');
var config = require('./../config.json');
var connString = config.db.connString;


function Annoucement(id, title, description, price, photos, owner, category, locate, state)
{
	this.id = id;
	this.title = title;
	this.description = description;
	this.price = price;
	this.photos = photos, 
	this.owner = owner;
	this.category = category;
	this.locate = locate;
	this.state = state;
}

function AnnoucementShort(id, title, description, price, photos, category, locate)
{
	this.id = id;
	this.title = title;
	this.description = description;
	this.price = price;
	this.photos = photos,
	this.category = category;
	this.locate = locate;
}

module.exports.Annoucement = Annoucement;


//limite para paginar
module.exports.getAllAnnoucement = function(limit,cb)
{
	pg.connect(connString, function(err, client, done) {

		if(err) return cb(err);

		//client.query("SELECT * FROM Annoucement AS a WHERE a.state=true LIMIT $1",
		client.query("SELECT * FROM \"Annoucement\"",
			function(err, result)
			{
				done();
				if(err) return cb(err);
				//console.log(result);
				var annouce = result.rows.map(function(row) {
					return new AnnoucementShort(row.annouce_id, row.title, row.description, row.price, row.photos, row.locate, row.category);
				});
				cb(null, annouce);
			}
		);
	});
}

module.exports.createAnnoucement = function(annoucement, cb)
{
	pg.connect(connString, function(err, client, done) {

		if(err) return cb(err);

		client.query("INSERT INTO \"Annoucement\"(title, description, price, photos, owner, category,  locate, state) VALUES($1, $2, $3, $4, $5, $6, $7, $8)",
			[annoucement.title, annoucement.description, annoucement.price, annoucement.photos, annoucement.owner, annoucement.category, annoucement.locate, annoucement.state],
			function(err, result)
			{
				done();
				if(err) return cb(err);
				if(result.rowCount != 1) return cb(new Error("DATA BASE NOT UPDATED"));
				cb(null, result.rows[0]);
			}
		);
	});
}

module.exports.getIdAnnoucement = function(id, cb)
{
	pg.connect(connString, function(err, client, done) {

		if(err) return cb(err);

		client.query("SELECT annouce_id, title, description, price, photos, owner, category, locate, state FROM \"Annoucement\" where annouce_id = $1",
			[id],
			function(err, result)
			{
				done();
				if(err) return cb(err);

				var annouce = new Annoucement(result.rows[0].id, result.rows[0].title, result.rows[0].description, result.rows[0].price, result.rows[0].photos, result.rows[0].owner, result.rows[0].category, result.rows[0].locate, result.rows[0].state);
				cb(null, annouce);
			}
		);
	});

}