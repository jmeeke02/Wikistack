var express = require('express');
var router = express.Router();
var models = require('../models/');
var Page = models.Page; 
var User = models.User; 


router.get('/add', function(request, response, next){
	response.render("addpage");
});

router.get('/search/', function(request, response, next){
	var query = Page.findByTag(request.query.tags);
	query.then(function(pages){
		response.render("index", {titles: pages})
	})
})

router.get('/:urlTitle', function(request, response, next) {
	// response.send(request.params.urlTitle);
	console.log("url test");
	var query = Page.findOne({urlTitle: request.params.urlTitle});
	query.exec(function(err, page){
		 if (err) return handleError(err);
		 response.render("wikipage", {page: page});
	});
});

router.get('/', function(request, response, next){
	response.redirect('/');
});

router.post('/', function(request, response, next){
	var page = new Page({
	    title: request.body.title,
	    content: request.body.content,
	    tags: request.body.tags.split(" ")
	  });
	page.save()
	.then(function(page){
		response.redirect(page.fullTitle);
	}).then(null, function(err){
		console.log(err);
	})

});


module.exports = router;
