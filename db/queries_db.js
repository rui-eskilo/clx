
var config = require(require('path').resolve(__dirname, "..", "config.js"));
var pg = require("pg");
var esk = require(require('path').resolve(__dirname));
console.log(esk);

module.exports.SelectAll = function(query, createElem, cb)
{
	pg.connect(config.getConnString(), function(err, client, done) {
		if(err) return cb("Error fetching client from pool: " + err);
		client.query(query, function(err, result) {
			if(err) return cb("Error running query: " + err);

			var elems = result.rows.map(createElem);
			done();
			console.log(esk);
			cb(null, elems);
		});
	});
}

module.exports.SelectAllWithParams = function(query, queryParams, createElem, cb)
{
	pg.connect(config.getConnString(), function(err, client, done) {
		if(err) return cb("Error fetching client from pool: " + err);
		client.query(query, queryParams, function(err, result) {
			if(err) return cb("Error running query: " + err);

			var elems = result.rows.map(createElem);
			done();
			cb(null, elems);
		});
	});
}

module.exports.SelectOne = function(query, queryParams, createElem, cb)
{
	pg.connect(config.getConnString(), function(err, client, done) {
		if(err) return cb("Error fetching client from pool: " + err);
		client.query(query, queryParams, function(err, result) {
			if(err) return cb("Error running query: " + err);

			if(result.rowCount == 0) return cb(null,null);
			if(result.rowCount > 1) return done() || cb("More than one element selected.", null);

			var elem = createElem(result.rows[0]);
			done();
			cb(null, elem);
		});
	});
}

module.exports.ExecuteQuery = function(query, queryParams, cb) {
	pg.connect(config.getConnString(), function(err, client, done) {
		if(err){console.log(">>>>>>>ERROR>>>>>>>>>>>Error fetching client from pool: " + err); return cb("Error fetching client from pool: " + err);}
		client.query(query, queryParams, function(err, result) {
			if(err){console.log(">>>>>>>>ERROR>>>>>>>>>>>>Error running query: " + err); return cb("Error running query: " + err);}

			//if(result.rowCount != 1) return done() || cb("Cannot execute the query: " + query, null);

			done();
			cb(null);
		});
	});
}