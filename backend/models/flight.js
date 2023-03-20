const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    duration: Number,
    airline_Rating: Number,
    price: Number,
    class: String,
    num_of_stops: Number,
    start_location: mongoose.Types.ObjectId,
    destination_location: mongoose.Types.ObjectId
});

module.exports = mongoose.model('Flight', flightSchema);