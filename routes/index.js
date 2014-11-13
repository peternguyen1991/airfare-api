var express = require('express');
var request = require('request');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/airfares/page/:page', function(req, res){
	var page = req.params.page;
	var url = 'http://128.199.222.42:3000/api/airfares/page/' + page;
	request({url: url}, function (error, response, body){
		var json = JSON.parse(body);
		json.forEach(function(value){
			var value.priceOptions = [];
			var price = JSON.parse(value.price).Price;
			json.priceOptions.push(price);
		});
		res.render('airfares', { json: json });
	});
})

module.exports = router;