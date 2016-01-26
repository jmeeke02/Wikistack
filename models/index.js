var mongoose = require('mongoose');
// Notice the `mongodb` protocol; Mongo is basically a kind of server,
// which handles database requests and sends responses. It's async!
var Schema = mongoose.Schema;
var pageSchema = new Schema({
	title: {type: String, required: true},
	urlTitle: {type: String, required: true},
	content: {type: String, required: true},
	date:  {type: Date, default: Date.now},
	status: {type: String, enum: [ 'open', 'closed']},
	author: {type: Schema.Types.ObjectId, ref: 'User'} //must me document Ids from User
})

var userSchema = new Schema({
	name: {type: String, required: true},
	email: {type: String, required: true, unique: true}
});

var Page = mongoose.model('Page', pageSchema);
var User = mongoose.model('User', userSchema);

pageSchema.virtual('fullTitle').get(function(){
	return "/wiki/" + this.urlTitle;
});


mongoose.connect('mongodb://localhost/wikistack'); // <= db name will be 'wikistack'
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongodb connection error:'));

module.exports = {
  Page: Page,
  User: User
};