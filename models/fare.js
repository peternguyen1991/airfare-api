var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var FareSchema = new Schema({
    date_search: {type: Date, default: Date.now},
    IataOrigin: String,
    IataDestination: String,
    OriginStation: String,
    DestinationStation: String,
    airlines: String,
    fareclass: String,
    departure: String,
    arrival: String,
    durations: Number,
    flight_numbers: String,
    number_of_stops: Number,
});

module.exports = mongoose.model('Fare', FareSchema);