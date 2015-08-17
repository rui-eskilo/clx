var db = require('./queries_db');

function Comment(id, annoucement_id, userid, comment_text, comment_response, creation_date) {
	this.id = id || require("node-uuid").v4();
	this.annoucement_id = annoucement_id;
	this.userid = userid;
	this.comment_text = comment_text || "- sem texto -";
	this.comment_response = comment_response || "--";
	this.creation_date = creation_date || new Date();
}

module.exports.Comment = Comment;

module.exports.Comment.getAllComments = function(cb)
{
	db.SelectAll("SELECT id, annoucement_id, userid, comment_text, comment_response, creation_date from comments ORDER BY creation_date desc",
		function(row) { return new Comment(row.id, row.annoucement_id, row.userid, row.comment_text, row.comment_response, row.creation_date); },
		cb);
}

module.exports.Comment.getAllByAnnoucement_id = function(annoucement_id, cb)
{
	db.SelectAllWithParams("SELECT id, annoucement_id, userid, comment_text, comment_response, creation_date FROM comments WHERE annoucement_id=$1 ORDER BY creation_date desc",
		[annoucement_id],
		function(row) { return new Comment(row.id, row.annoucement_id, row.userid, row.comment_text, row.comment_response, row.creation_date); },
		cb);
};

module.exports.Comment.createNew = function(comment, cb)
{
	db.ExecuteQuery("INSERT into comments(id, annoucement_id, userid, comment_text, comment_response , creation_date) VALUES($1, $2, $3, $4, $5, $6)",
		[comment.id, comment.annoucement_id, comment.userid, comment.comment_text, comment.comment_response , comment.creation_date],
		function(err) { cb(err, comment.id) }
	);
};


module.exports.Comment.setResponse = function(text_response, comment_id, cb)
{

	console.log(">>>>>>>>>>QUERY_TEST>>>>>>>>: "+"UPDATE comments SET comment_response = "+text_response+" WHERE id="+comment_id);

	db.ExecuteQuery("UPDATE comments SET comment_response = $2 WHERE id=$1",
		[comment_id, text_response],
		function(err) { cb(err, comment_id) }
	);
};