var express = require('express');
var router = express.Router();
var models = require('../models/'); //defaults to find the index.js, dont have to 
//specify, ../modes/index.js would be redundant
var Page = models.Page;
var User = models.User;
var Promise = require('bluebird');


router.get('/:userID', function(req, res, next){
	var userPromise = User.findOne({_id: req.params.userID}).exec();
	var pagePromise = Page.find({author: req.params.userID}).exec();
	Promise.all([userPromise, pagePromise])
	.then(function(promiseArr){
		console.log('pages', promiseArr[0], promiseArr[1]);
		res.render('singleuser', {user: promiseArr[0], pages: promiseArr[1]});
	}).catch(next);
});

router.get('/', function(req, res, next){
	User.find({}).exec().then(function(users){
		res.render('users', {users: users});
	});
});

module.exports = router;