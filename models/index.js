var mongoose = require('mongoose');
var marked = require('marked');
// Notice the `mongodb` protocol; Mongo is basically a kind of server,
// which handles database requests and sends responses. It's async!
var Schema = mongoose.Schema;
var pageSchema = new Schema({
	title: {type: String, required: true},
	urlTitle: {type: String, required: true},
	content: {type: String, required: true},
	date:  {type: Date, default: Date.now},
	status: {type: String, enum: [ 'open', 'closed']},
	author: {type: Schema.Types.ObjectId, ref: 'User'}, //must me document Ids from User
	tags: {type: [String]}
});

//pageSchema.path(otherproperty){
// 	otherproperty: String
// }

var userSchema = new Schema({
	name: {type: String, required: true},
	email: {type: String, required: true, unique: true}
});

//virtuals, hooks, statics, all of these gets defined on the schema, schema
//lets us define the model, all these define whats on the model
//not put on models, models are tools that allow us to access databases
//virtuals are like functions but auto invoked for you, can't do fullTitle()
pageSchema.virtual('fullTitle').get(function(){
	return '/wiki/' + this.urlTitle;
});

pageSchema.virtual('renderedContent').get(function(){
	return marked(this.content);
});
//important to note when we call virtuals, hooks methods, the this
//becomes the specific page were accessing or triggering that virtual for
//not the case with statics

//need this to happen before we validate a document
//create a hook in the page, goes on Schema
//pre validate, whenver a page is going into validate, always takes a next for each hook
//these hooks can be async
//this keyword in a hook specfic to the actual page were currently working with, represented with a this keyword
pageSchema.pre('validate', function generateUrlTitle(next){
  if(this.title){
		newTitle = this.title.replace(/[^a-z\d\s]/ig, "");
		this.urlTitle = newTitle.replace(/\s/g, "_");
	}else{
    this.urlTitle = Math.random().toString(36).substring(2, 7);
  }
  next();
});

//methods are on the document, like on prototype
	//need to be used on a specific documen
	//this is a particular document
	//all documents/pages get access, would call on a new instance of Page
	//var page = new Page()
	//page.method()
//statics s on the Class, class method
	//a method on the model not a document
	//deals with no document in particular
	//this when a static runs is actually on a model
	//static has to be called on the Class itself so
	//Page.static would look through the model to find instances of pages in the model by tag such as findByTag

userSchema.statics.findOrCreate = function(obj){
	var self = this; //this is the model (User) inside a static function
	var promiseA = this.findOne({email: obj.email}).exec();
	return promiseA.then(function(user){  //need to return promise dummy
		//this would be changed by the callback function
		//when you need to use this in the promise callback use the self pattern to save your this context
		console.log('test', user);
		if(user) return user;
		else return self.create({ //why can't I use User here?, solution says to use self.create , 
			//becuase User isnt defined until later? but this lets us keep a reference to the User we called find or create on
			name: obj.name,
			email: obj.email
		});
	});
};



// pageSchema.methods.
pageSchema.statics.findByTag = function(tag){
	return this.find({ tags: { $elemMatch: { $eq : tag}}}).exec()
};
//call it through model directly like Page
pageSchema.methods.findSimilar = function(page){
	return this.model('Page').find({tags: { $in: this.tags }});
}

var Page = mongoose.model('Page', pageSchema);
var User = mongoose.model('User', userSchema);



mongoose.connect('mongodb://localhost/wikistack'); // <= db name will be 'wikistack'
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongodb connection error:'));

module.exports = {
  Page: Page,
  User: User
};

// find, findOne
//use populate when you're dong a query 

// page.find({page: "test"}).populate('ownerId').exec()
// page.ownerId.name = "Tom";

//owner is the field to reference 

// Story
// .findOne({ title: 'Once upon a timex.' })
// .populate('_creator')
// .exec(function (err, story) {
//   if (err) return handleError(err);
//   console.log('The creator is %s', story._creator.name);
//   // prints "The creator is Aaron"
// });