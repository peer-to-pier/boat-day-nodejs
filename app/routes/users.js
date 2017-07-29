var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
	res.render('guest', { 
		name: 'guest', 
		title: 'Users' 
	});
});

router.post('/facebook', function(req, res, next) {
	Parse.FacebookUtils.logIn({
		id: String(req.body.userID),
		access_token: req.body.accessToken,
		expiration_date: new Date(new Date().getTime() + req.body.expiresIn * 1000).toISOString()
	}).then(function(user) {
		req.session.userToken = user.get('sessionToken');
		res.send({ redirect: '/users/' + user.id + '/dashboard' });
	}, function(error) {
		res.status(400).send(error);
	});
});

router.post('/login', function(req, res, next) {
	Parse.User.logIn(req.body.email, req.body.pass).then(function(user) {
		req.session.userToken = user.get('sessionToken');
		res.send({ redirect: '/users/' + user.id + '/dashboard' });
	}, function(error) {

		if( error.code === 200 ) {
			error.message = 'Email is required.';
		}

		if( error.code === 101 ) {
			error.message = 'Invalid email/password.';
		}
		
		res.status(400).send(error);
	});
});

router.post('/signup', function(req, res, next) {
	var user = new Parse.User();
	user.set('username', req.body.email);
	user.set('email', req.body.email);
	user.set('password', req.body.pass);
	user.signUp().then(function() {
		req.session.userToken = user.get('sessionToken');
		res.send({ redirect: '/users/' + user.id + '/dashboard' });
	}, function(error) {
		res.send(error);
	});
});

router.get('/logout', function(req, res, next) {
	Parse.User.logOut().then(function() {
		req.session = null;
		res.redirect('../');	
	});
});

module.exports = router;
