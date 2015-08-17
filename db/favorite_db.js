var db = require('./queries_db');

function Favorite(id, username, annoucement_id) {
	this.id = id || require("node-uuid").v4();
	this.username = username;
	this.annoucement_id = annoucement_id;
}

module.exports.Favorite = Favorite;

module.exports.Favorite.getAllFavorites = function(cb)
{
	db.SelectAll("SELECT id, username, annoucement_id FROM favortite",
		function(row) { return new Favorite(row.id, row.username, row.annoucement_id); },
		cb);
}


module.exports.Favorite.getAllFavoritesByUsername = function(username, cb)
{
	db.SelectAllWithParams("SELECT id, username, annoucement_id FROM favortite where username=$1 limit 1",
		[username],
		function(row) { return new Favorite(row.id, row.username, row.annoucement_id); },
		cb);
}


module.exports.Favorite.createNew = function(favorite, cb)
{
	db.ExecuteQuery("INSERT into favorite(id, username, annoucement_id) values($1, $2, $3)",
		[favorite.id, favorite.username, favorite.annoucement_id],
		function(err) { cb(err, favorite.id) }
	);
};