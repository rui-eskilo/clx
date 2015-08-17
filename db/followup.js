var db = require('./queries_db');

function Followup(userid, annoucementid, activity) {
	this.userid = userid || "";
	this.annoucementid = annoucementid || "";
	this.activity = activity || false;  // activity is boolean. Default: false
}
module.exports.Followup = Followup;


module.exports.Followup.getAllFollowupByUser = function(userid, cb)
{
	db.SelectAllWithParams("SELECT user_id, annoucement_id, activity FROM followup WHERE user_id = $1",
		[userid],
		function(row) { return new Followup(row.user_id, row.annoucement_id, row.activity); },
		cb);
}



module.exports.Followup.getAllActivityByUser = function(userid, cb)
{
	db.SelectAllWithParams("SELECT user_id, annoucement_id, activity FROM followup WHERE activity = true and user_id = $1",
		[userid],
		function(row) { return new Followup(row.user_id, row.annoucement_id, row.activity); },
		cb);
}

module.exports.Followup.getByUserAndAnnoucement = function(userid, annoucementid, cb)
{
	db.SelectOne("SELECT user_id, annoucement_id, activity FROM followup WHERE user_id=$1 and annoucement_id=$2 limit 1",
		[userid, annoucementid],
		function(row) { return new Followup(row.user_id, row.annoucement_id, row.activity); },
		cb);
};

module.exports.Followup.updateFollowupActivity = function(userid, annoucementid, cb)
{
	db.ExecuteQuery("UPDATE followup SET activity = false WHERE user_id=$1 and annoucement_id=$2",
		[userid, annoucementid],
		function(err) { cb(err, userid) });
};

module.exports.Followup.updateAnnoucementActivity = function(annoucementid, cb)
{
	db.ExecuteQuery("UPDATE followup SET activity = true WHERE annoucement_id=$1",
		[annoucementid],
		function(err) { cb(err, annoucementid) });
};

module.exports.Followup.createNew = function(followup, cb)
{
	var params = [followup.userid, followup.annoucementid, followup.activity];
	db.ExecuteQuery("INSERT into followup(user_id,annoucement_id,activity) values($1, $2, $3)",
		params,
		function(err) { cb(err) }
	);
};


module.exports.Followup.deleteFollowup = function(userid, annoucementid, cb)
{
	var params = [userid, annoucementid];
	db.ExecuteQuery("DELETE FROM followup WHERE user_id=$1 AND annoucement_id=$2",
		params,
		function(err) { cb(err) }
	);
};

