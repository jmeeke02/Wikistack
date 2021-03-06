var express = require('express');
var router = express.Router();
var models = require('../models/'); //defaults to find the index.js, dont have to 
//specify, ../modes/index.js would be redundant
var Page = models.Page;
var User = models.User;
var Promise = require('bluebird');


router.get('/:userID', function(req, res, next){
	var pagePromise = Page.find({author: req.params.userID}).exec()
	.populate('author')
	.then(function(pages){
		res.render('singleuser', {user: pages.author.name, pages: pages});
	}).catch(next);
});

router.get('/', function(req, res, next){
	User.find({}).exec().then(function(users){
		res.render('users', {users: users});
	});
});

module.exports = router;