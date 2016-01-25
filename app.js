var express = require('express');
var app = express();
var morgan = require('morgan');
var swig = require('swig');
var routes = require('./routes/');
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

app.use('/', routes);