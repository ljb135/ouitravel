const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    airline: String,
    class: String,
    price: Number,
    start_location: mongoose.Types.ObjectId,
    destination_location: mongoose.Types.ObjectId,
    departure_time: Date,
    
    flight_details: Object
});

module.exports = mongoose.model('Flight', flightSchema);