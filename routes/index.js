var express = require('express');
var router = express.Router();
var Page = require('../models/index.js').Page;
var User = require('../models/index.js').User;


router.get('/', function(req, res){
	res.render('index');
})

//page.fullTitle

module.exports = router;

// var page = new PageModel({
	
// })