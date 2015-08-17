var db = require('./queries_db');

function Rating(val) {
	this.val = val;
}

module.exports.Rating = Rating;

module.exports.Rating.getAllRatings = function(cb)
{
	db.SelectAll("SELECT val FROM rating",
		function(row) { return new Rating(row.val); },
		cb);
}


module.exports.Rating.createNew = function(rating, cb)
{
	db.ExecuteQuery("INSERT into rating(val) values($1)",
		[rating.val],
		function(err) { cb(err, rating.val) }
	);
};

