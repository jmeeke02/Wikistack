var express = require('express');
var router = express.Router();
var Page = require('../models/index.js').Page;
var User = require('../models/index.js').User;


router.get('/', function(req, res){
	var query = Page.find({}).select('title urlTitle');
	query.exec(function(err, pages){
		console.log(pages);
		res.render('index', {titles: pages});
	})
	
})

router.get('/search', function(req, res){
	res.render('search');
})

//page.fullTitle

module.exports = router;

// var page = new PageModel({
	
// })