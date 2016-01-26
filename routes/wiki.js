var express = require('express');
var router = express.Router();
var Page = require('../models/index.js').Page;
var User = require('../models/index.js').User;

router.get('/', function(request, response, next){
	response.send("Success Get");
});

router.post('/', function(request, response, next){
	response.send("Success Post");
});

router.get('/add', function(request, response, next){
	response.send("Success Add");
});

module.exports = router;