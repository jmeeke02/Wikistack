var express = require('express');
var app = express();
var morgan = require('morgan');
var swig = require('swig'); 
require('./filters')(swig); //looks for index.js, filters/index.js returns a function
//expects to have the swig library passed in and sets the passed in swig as swig.setFilter
var routes = require('./routes/');
var wikiRouter = require('./routes/wiki');
var userRouter = require('./routes/users');
var bodyParser =  require('body-parser');

//Swig boilerplate code
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
swig.setDefaults({cache: false});

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.listen(3000,function(){
	console.log('server listening');
})

app.use(morgan('dev'));

app.use(express.static('public'));

app.use('/wiki', wikiRouter);
app.use('/users', userRouter);
//if request mounted with /wiki, request is dropped into the subrouter
// /wiki, by using the mount, we can look for anything after /wiki/
app.use('/', routes);