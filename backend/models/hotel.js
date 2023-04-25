const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
    _id: String,
    hotel_name: String,
    longitude: Number,
    latitude: Number,
    room_description: String,
    num_rooms: Number,
    price: Number,
    check_in: Date,
    check_out: Date
});

module.exports = mongoose.model('Hotel', hotelSchema);