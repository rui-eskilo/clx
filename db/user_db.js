var db = require('./queries_db');


var User = function(username, password, name, mail, since, votes_somatory, votes_users) {
  this.username = username || "UN";  // UN - Utilizador Não Autenticado   (é possível criar um user não autenticado com new User() )
  this.password = password || "";
  this.name = name || "UN";
  this.mail = mail || "";
  this.since = since || new Date(); 
  this.votes_somatory = votes_somatory || 0;
  this.votes_users = votes_users || 0;
  this.isAuthenticated = false;
  this.isCorrectPassword = function(password){ return this.password == password; }
  this.getRating = function(){ return votes_somatory / votes_users; }
}

module.exports.User = User;

module.exports.User.getAllUsers = function(cb)
{
 db.SelectAll("SELECT username, password, name, mail, since, votes_somatory, votes_users FROM _user order by name",
  function(row) { return new User(row.username, row.password, row.name, row.mail, row.since, row.votes_somatory, row.votes_users); },
  cb);
};

module.exports.User.getByUsername = function(username, cb)
{
  db.SelectOne("SELECT username, password, name, mail, since, votes_somatory, votes_users FROM _user where username=$1 limit 1",
    [username],
    function(row) { return new User(row.username, row.password, row.name, row.mail, row.since, row.votes_somatory, row.votes_users); },
    cb);
};

module.exports.User.getByMail = function(mail, cb)
{
  db.SelectOne("SELECT username, password, name, mail, since, votes_somatory, votes_users FROM _user where mail=$1 limit 1",
    [mail],
    function(row) { return new User(row.username, row.password, row.name, row.mail, row.since, row.votes_somatory, row.votes_users); },
    cb);
};

/*
module.exports.User.getRating = function(username, cb)
{
  User.getByUsername(username, function(err, user)
    {
      if(err) return res.status(500).send("Inacarditável! Server Error.");
      return (user.votes_somatory / user.votes_users);
    });
};
*/


module.exports.User.createNew = function(user, cb)
{
 db.ExecuteQuery("INSERT into _user(username, password, name, mail, since, votes_somatory, votes_users) values($1, $2, $3, $4, $5, $6, $7)",
  [user.username, user.password, user.name, user.mail,user.since, user.votes_somatory, user.votes_users],
  function(err) { cb(err, user.username) }
  );
};


module.exports.User.changePassword = function(user, cb)
{
  db.ExecuteQuery("UPDATE _user SET password = $2 where username = $1",
    [user.username, user.password],
    function(err) { cb(new Error(err), user);
    }
  );
};


module.exports.User.updateRating = function(user, cb)
{
  db.ExecuteQuery("UPDATE _user SET votes_somatory = $2 , votes_users = $3 WHERE username = $1",
    [user.username, Number(user.votes_somatory), Number(user.votes_users)],
    cb
  );
/*
    db.ExecuteQuery("UPDATE _user SET votes_users = votes_users + 1 WHERE username = $1",
    [username],
    function(err) { cb(new Error(err)); }
  );
*/
};

