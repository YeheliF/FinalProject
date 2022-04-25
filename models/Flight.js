var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//creat schema
flightSchema = new mongoose.Schema ({
    idUser: String,
    flightNumber: String,
    Date: Date,
    Departure: String,
    DepartureTime: String,
    Arrival: String,
    ArrivalTime: String,
    Terminal: String
})

module.exports = mongoose.model('Flights', flightSchema)