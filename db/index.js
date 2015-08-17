var Annoucement = require('./annoucement_db').Annoucement;
var User = require('./user_db').User;
var Comment = require('./comment_db').Comment;
var Category = require('./category_db').Category;
var Session = require('./session').Session;
var Vote = require('./vote_db').Vote;
var Rating = require('./rating_db').Rating;
var Favorite = require('./favorite_db').Favorite;
var Followup = require('./followup').Followup;

module.exports = {  Annoucement: Annoucement,
					User: User,
					Comment: Comment,
					Category: Category,
					Session: Session,
					Vote: Vote,
					Rating: Rating,
					Favorite: Favorite,
					Followup: Followup
				};


require('./fillWithSampleData')(Annoucement, User, Comment, Category, Vote, Rating, Favorite, Followup);