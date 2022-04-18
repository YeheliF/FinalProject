var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//creat schema
flightSchema = new mongoose.Schema ({
    idUser: String,
    flightNumber: String,
    Date: Date
})

module.exports = mongoose.model('Flights', flightSchema)