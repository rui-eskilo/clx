var db = require('./queries_db');


var Photo = function(announcement_id, photosArr) {
  this.announcement_id = announcement_id;
  this.photos = photosArr || [];
}

module.exports.Photo = Photo;

module.exports.Photo.createNew = function createNewPhoto(photo, cb)
{
  console.log('INSERT into Photos(annoucem_id, photos) values($1, $2)', photo.announcement_id, photo.photos);
  db.ExecuteQuery("INSERT into Photos(annoucem_id, photos) values($1, $2)",
    [photo.announcement_id, photo.photos],
    function(err) { cb(err, photo.announcement_id) }
  );
};

module.exports.Photo.getAllByAnnoucement_id = function(annoucement_id, cb)
{
  db.SelectOne("SELECT photos FROM Photos WHERE annoucem_id=$1",
  [annoucement_id],
  function(row) { return row.photos; },
  cb);
};



module.exports.Photo.edit = function updatePhoto(photo, cb)
{
  console.log('UPDATE Photos SET (photos)=(%2) WHERE annoucem_id=%1', photo.announcement_id, photo.photos);
  db.ExecuteQuery("UPDATE Photos SET (photos)=($2) WHERE annoucem_id=$1",
    [photo.announcement_id, photo.photos],
    function(err) { cb(err, photo.announcement_id) }
  );
};