var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var instance2 = require('../config/db_conf')

//creat schema
flightSchema = new mongoose.Schema ({
    idUser: String,
    flightNumber: String,
    Date: String,
    Departure: String,
    DepartureTime: String,
    Arrival: String,
    ArrivalTime: String,
    Terminal: String,
    delayDateUpdate: String,
    delayHourUpdate: String,
    MachinePred: String
})

module.exports = instance2().model('flight_project', flightSchema)