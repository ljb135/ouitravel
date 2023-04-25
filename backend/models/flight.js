const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
    airline: String,
    travelClass: String,
    price: Number,
    start_location: String,
    destination_location: String,
    departure_departure_time: Date,
    departure_arrival_time: Date,
    return_departure_time: Date,
    return_arrival_time: Date,
    flight_offer: Object
});

module.exports = mongoose.model('Flight', flightSchema);