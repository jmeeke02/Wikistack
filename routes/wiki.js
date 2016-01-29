var express = require('express');
var router = express.Router();
var models = require('../models/'); //defaults to find the index.js, dont have to 
//specify, ../modes/index.js would be redundant
var Page = models.Page; 
var User = models.User; 

//make routes go most to least specific
//express subrouter lets you creates subroutes
//like for /wiki/ can created a bunch of subroutes on the same
//wiki mount, app.us, strips off the /wiki mount
//all these are subrouters mounted on /wiki
router.get('/add', function(request, response, next){
	response.render("addpage");
});

//when a form makes a get request, it adds the value on the query, not on the params.body
router.get('/search/', function(request, response, next){
	var query = Page.findByTag(request.query.tags);
	query.then(function(pages){
		response.render("index", {titles: pages});
	});
});

//first find the current page, then use current pages tags in find similar, since its a method it needs to be called on an instance of Page, page
router.get('/:urlTitle/similar', function(request, response, next){
	var pageQuery = Page.findOne({urlTitle: request.params.urlTitle}).exec();
	pageQuery.then(function(page){
		return page.findSimilar(page.tags);
	}).then(function(pages){
		response.render("index", {titles: pages});
	});
});

// /wiki/(dynamic value)
router.get('/:urlTitle', function(request, response, next) {
	// response.send(request.params.urlTitle);
	console.log("url test");
	var query = Page.findOne({urlTitle: request.params.urlTitle}).populate('author').exec();
	//dont have to actually execute, the .then will execute for you
	//a hidden exec going on
	//var query = Page.find({}) - this is a query
	//var thePromise = query.exec() -- this is a promise
	query.then(function(page){
		 response.render("wikipage", {page: page, tags: page.tags, author: page.author});
		 console.log(page.tags);
	}, function(err){
		return handleError(err);
	});
});

router.get('/', function(request, response, next){
	Page.find({}).exec()
		.then(function (pages){
			response.render('index', {titles: pages});
		}).then(null, function(err){
			console.error(err);
		});
	//OR response.redirect('/'); handle in index.js
});

router.post('/', function(request, response, next){
	
	var page = new Page({
	    title: request.body.title,
	    content: request.body.content,
	    tags: request.body.tags.split(" ")
	 });

	User.findOrCreate(request.body) //cannot read property then of undefined, why
	.then(function(user){
		console.log('got here');
		page.author = user._id;
		return page.save();
	})
	//page doesn't exist in the mongo database yet
	//need to call the save function, take the page, runs validation and saves to DB
	.then(function(savepage){
		response.redirect(savepage.fullTitle);
	}).then(null, next);

});


module.exports = router;
