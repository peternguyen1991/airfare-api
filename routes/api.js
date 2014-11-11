var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/airfare2');
var fare = require('../models/fare');

/* GET home page. */
router.get('/', function(req, res) {
    res.json({
        message: 'Welcome to AirFare API!'
    });
});

/* GET all airfares */
router.get('/airfares/page/:page', function(req, res) {
	var perPage = 10
  		,page = Math.max(0, req.params.page);
	fare.count(function(err, count){
		var total = count;
		fare.find().limit(perPage).skip(perPage * page).exec(function(err, fares){
	        if (err)
	            res.send(err);
	        res.json(fares);
	    });
	});
});

/*router.get('/airfares/date/:date/page/:page', function(req, res) {
	var perPage = 10
  		,page = Math.max(0, req.params.page);

	var date = new Date(req.params.date);
	//res.end(date);
	fare.count(function(err, count){
		var total = count;
		fare.find().where('date_search').gt(new Date('2014-11-11')).lt('2014-11-12').limit(perPage).skip(perPage * page).exec(function(err, fares){
	        if (err)
	            res.send(err);
	        res.json(fares);
	    });
	});
});*/

module.exports = router;