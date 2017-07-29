var express			= require('express');
var path			= require('path');
var favicon			= require('serve-favicon');
var logger			= require('morgan');
var cookieParser	= require('cookie-parser');
var bodyParser		= require('body-parser');
var session			= require('express-session');
GLOBAL.ParseServer	= require('parse-server').ParseServer;
GLOBAL.Parse		= require('parse/node').Parse;

var routes	= require('./routes/index');
var users	= require('./routes/users');

var app = express();

var api = new ParseServer({
	databaseURI: process.env.MONGOLAB_URI,
	cloud: path.join(__dirname, 'cloud', 'main.js'),
	appId: process.env.PARSE_APP_ID,
	masterKey: process.env.PARSE_MASTER_KEY,
	serverURL: process.env.PARSE_SERVER_URL,
	facebookAppIds: [process.env.FB_APP_ID]
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser("where banana choco gold"));
app.use(session({
	secret: 'random key for the banana',
	resave: false,
	saveUninitialized: true
}));

app.use('/parse', api);

GLOBAL._SessionUser = null;

app.use(function(req, res, next) {
	
	_SessionUser = null;

	console.log(api.User);

	if( req.session.userToken ) {
		Parse.User.become(req.session.userToken).then(function(user) { 
			_SessionUser = true;
			next();
		}, function() {
			next();
		});
	} else {
		next();
	}
});

app.use('/', routes);
app.use('/users', users);

app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});

module.exports = app;
