var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { 
		name: 'home', 
		title: 'Our mission' 
	});
});

router.get('/hosts', function(req, res, next) {
	res.render('hosts', { 
		name: 'hosts', 
		title: 'Become a host' 
	});
});

router.get('/legal', function(req, res, next) {
	res.render('legal', { 
		name: 'legal', 
		title: 'BoatDay Legal' 
	});
});


module.exports = router;
