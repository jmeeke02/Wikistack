var express = require('express');
var router = express.Router();
var Page = require('../models/index.js').Page;
var User = require('../models/index.js').User;


router.get('/', function(req, res){
	res.render('index');
})

router.get('/:urlTitle', function(req, res){
	page.virtual(req.params.urlTitle).get(function(){
	res.render(this.content);
	});
});

module.exports = router;

// var page = new PageModel({
	
// })