var db = require('./queries_db');

function Category(id, name) {
	this.id = id || require("node-uuid").v4();
	this.name = name || "";
}

module.exports.Category = Category;

module.exports.Category.getAllCategories = function(cb)
{
	db.SelectAll("SELECT id, name from Category",
		function(row) { return new Category(row.id, row.name); },
		cb);
}

module.exports.Category.getById = function(id, cb)
{
	db.SelectOne("SELECT id, name from Category where id=$1 limit 1",
		[id],
		function(row) { return new Category(row.id, row.name); },
		cb);
};

module.exports.Category.createNew = function(category, cb)
{
	db.ExecuteQuery("INSERT into Category(id, name) values($1, $2)",
		[category.id, category.name],
		function(err) { cb(err, category.id) }
	);
};


