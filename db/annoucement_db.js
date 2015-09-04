var db = require('./queries_db');

function Annoucement(annouce_id, title, description, owner, category, locate, price, _date, _state) {
	this.annouce_id = annouce_id || require("node-uuid").v4();
	this.title = title || "não atribuído";
	this.description = description || "não atribuído";
	this.owner = owner;
	this.category = category;
	this.locate = locate || "não atribuído";
	this.price = price || "não atribuído"
	this._date = _date || new Date();
	this._state = (_state === undefined ? 'activo' : _state);   // o outro estado possível: 'cancelado'
}

module.exports.Annoucement = Annoucement;

module.exports.Annoucement.getAllAnnoucements = function(cb)
{
	db.SelectAll("SELECT annouce_id, title, description, owner, category, locate, price, _date, _state FROM Annoucement ORDER BY _date desc",
		function(row) { return new Annoucement(row.annouce_id, row.title, row.description, row.owner, row.category, row.locate, row.price, row._date, row._state); },
		cb);
}


module.exports.Annoucement.getAllAnnoucementsByUsername = function(username, cb)
{
	db.SelectAllWithParams("SELECT annouce_id, title, description, owner, category, locate, price, _date, _state FROM Annoucement WHERE owner=$1  ORDER BY _date desc",
		[username],
		function(row) { return new Annoucement(row.annouce_id, row.title, row.description, row.owner, row.category, row.locate, row.price, row._date, row._state); },
		cb);
}


module.exports.Annoucement.getAllAnnoucementsByCategory = function(category_id, cb)
{
	db.SelectAllWithParams("SELECT annouce_id, title, description, owner, category, locate, price, _date, _state FROM Annoucement WHERE category=$1  ORDER BY _date desc",
		[category_id],
		function(row) { return new Annoucement(row.annouce_id, row.title, row.description, row.owner, row.category, row.locate, row.price, row._date, row._state); },
		cb);
}



module.exports.Annoucement.getById = function(id, cb)
{
	db.SelectOne("SELECT annouce_id, title, description, owner, category, locate, price, _date, _state FROM Annoucement WHERE annouce_id=$1 limit 1",
		[id],
		function(row) { return new Annoucement(row.annouce_id, row.title, row.description, row.owner, row.category, row.locate, row.price, row._date, row._state); },
		cb);
};

module.exports.Annoucement.createNew = function(annoucement, cb)
{
	db.ExecuteQuery("INSERT INTO Annoucement(annouce_id, title, description, owner, category, locate, price, _date, _state) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
		[annoucement.annouce_id, annoucement.title, annoucement.description, annoucement.owner, 
		annoucement.category, annoucement.locate, annoucement.price, annoucement._date, annoucement._state],
		function(err) { cb(err, annoucement.annouce_id) }
	);
};

module.exports.Annoucement.edit = function(annoucement, cb)
{
	db.ExecuteQuery("UPDATE Annoucement SET (title, description, owner, category, locate, price, _date, _state) = ($2, $3, $4, $5, $6, $7, $8, $9) WHERE annouce_id = $1",
		[annoucement.annouce_id, annoucement.title, annoucement.description, annoucement.owner
	                  , annoucement.category, annoucement.locate, annoucement.price, annoucement._date
	                  , annoucement._state],
		function(err) { cb(err, annoucement.annouce_id);
		}
	);
};

module.exports.Annoucement.changeStateById = function(id, newState, cb)
{
	db.ExecuteQuery("UPDATE Annoucement SET _state =$2 WHERE annouce_id = $1",
		[id, newState],
		cb
	);
};


module.exports.Annoucement.deleteById = function(id, cb)
{
	db.ExecuteQuery("DELETE FROM Annoucement WHERE annouce_id = $1",
		[id],
		cb
	);
};
