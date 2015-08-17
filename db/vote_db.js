var db = require('./queries_db');

function Vote(vote_id, username_salesman, username, rate) {
	this.vote_id = vote_id || require("node-uuid").v4();
	this.username_salesman = username_salesman || '';
	this.username = username || '';
	this.rate = rate;
}

module.exports.Vote = Vote;

module.exports.Vote.getByUsername = function(username_salesman, username, cb)
{
  db.SelectOne("SELECT rate FROM vote where username_salesman = $1 and username = $2 limit 1",
    [username_salesman, username],
    function(row) { return row.rate || false; },
    cb);
};


module.exports.Vote.createNew = function(_vote, cb)
{
 var params = [_vote.username_salesman, _vote.username, _vote.rate];
 db.ExecuteQuery("INSERT into vote(username_salesman, username, rate) values($1, $2, $3)",
  params,
  function(err) { cb(err, _vote) }
  );
};