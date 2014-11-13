var request = require('request');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/airfare2');
//var db = mongoose.connection;

var fareSchema = mongoose.Schema({
    date_search: {type: Date, default: Date.now},
    IataOrigin: String,
    IataDestination: String,
    OriginStation: String, 
    DestinationStation: String,
    price: String,
    airlines: String, 
    fareclass: String,
    departure: String,
    arrival: String,
    durations: Number, 
    flight_numbers: String, 
    number_of_stops: Number
});
var Fare = mongoose.model('Fare', fareSchema);

var OriginStation = ['IAH', 'DFW', 'AUS', 'ORD', 'NYC', 'LAX', 'SFO', 'SEA', 'ATL', 'MIA', 'BOS', 'LAS'];
var DestinationStation = ['HAN', 'SGN', 'SIN', 'BKK', 'PEK', 'PVG', 'KUL', 'NRT', 'ICN', 'TPE'];
var DestinationStationTmp = DestinationStation.slice(0);
var cO = OriginStation.pop();
var cD = DestinationStationTmp.pop();
var error = false;
function search(day, callback){
	var url = 'http://kidgrow.spaces.puresolutions.com.vn/index/search?o='+cO+'&d='+cD+'&day='+day;
	console.log(url);
	request({url: url}, function (error, response, body){
		if(error){
			console.log('error');
		} else {
			try{
				var json = JSON.parse(body);
				console.log(json.length);
				try {
					if(json.length){
						json.forEach(function(element){
							setTimeout(function(){
								var fare = new Fare({
									IataOrigin: cO,
									IataDestination: cD,
									OriginStation: element.leg.OriginStation,
									DestinationStation: element.leg.DestinationStation,
									price: JSON.stringify(element.PricingOptions),
									airlines: JSON.stringify(element.leg.Carriers),
									fareclass: 'Eco',
									departure: element.leg.Departure,
									arrival: element.leg.Arrival,
									durations: element.leg.Duration,
									flight_numbers: JSON.stringify(element.leg.FlightNumbers),
									number_of_stops: element.leg.Stops.length,
								});
								fare.save(function(err){
									if (err) console.error(err);
									else console.log('Saved: ' + element.OutboundLegId);
								});	
							}, 0);
						});
					}
				} catch(ex){
					console.log('Database Exception');
				}
				
			} catch(e){
				error = true;
				console.log('SyntaxError');
			}
		}
		setTimeout(function(){
			if(!error){
				if(OriginStation.length > 0){
					if(DestinationStationTmp.length > 0){
						cD = DestinationStationTmp.pop();
					} else {
						DestinationStationTmp = DestinationStation.slice(0);
						cD = DestinationStationTmp.pop();
						cO = OriginStation.pop();
					}
					search(day, callback);
				} else {
					callback();
				}
			} else {
				search(day, callback);
			}
		}, 20000);
		
	});

}

function crawl(){
	search('2014-12-15', function(){
		console.log('DONE');
	});
}

crawl();