var pg = require('pg');
var config = require('./../config.json');
var connString = config.db.connString;


function Annoucement(id, title, description, owner, category, locate, state)
{
	this.id = id;
	this.title = title;
	this.description = description;
	this.owner = owner;
	this.category = category;
	this.locate = locate;
	this.state = state;
}

function AnnoucementShort(id, title, description, category, locate)
{
	this.id = id;
	this.title = title;
	this.description = description;
	this.category = category;
	this.locate = locate;
}

module.exports.Annoucement = Annoucement;



module.exports.getAllAnnoucement = function(limit,cb)
{
	pg.connect(connString, function(err, client, done) {

		if(err) return cb(err);

		//client.query("SELECT * FROM Annoucement AS a WHERE a.state=true LIMIT $1",
		//client.query("SELECT * FROM \"Annoucement\"", *******************************************************************
		client.query("SELECT * FROM Annoucement",
			function(err, result)
			{
								console.log(3);
								console.log(result);
				done();
				if(err) return cb(err);
				console.log(result);
				var annouce = result.rows.map(function(row) {
					return new AnnoucementShort(row.annouce_id, row.title, row.description, row.locate, row.category);
				});
				cb(null, annouce);
			}
		);
	});
}

