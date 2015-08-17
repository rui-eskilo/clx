var db = require('./queries_db');
var User = require('./user_db').User;

var Session = function(id, user) {
	this.id = id || require("node-uuid").v4();
	this.user = user;
}

module.exports.Session = Session;

module.exports.Session.getAllCategories = function(cb)
{
	db.SelectAll("SELECT id, name from Category",
		function(row) { return new Session(row.id, row.name); },
		cb);
}

module.exports.Session.getById = function(id, cb)
{
	db.SelectOne("SELECT id, name from Category where id=$1 limit 1",
		[id],
		function(row) { return new Category(row.id, row.name); },
		cb);
}

//Utilizador Não Autenticado
module.exports.Session.createNew_UN = function()
{
	/*
	db.ExecuteQuery("INSERT into Session(id, user) values($1, $2)",
		[null, null],
		function(err) { cb(err, category.id) }
	);
*/

	return new Session(null,new User());
}
