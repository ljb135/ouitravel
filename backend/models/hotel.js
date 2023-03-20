const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    name: String,
    rating: Number,
    price: Number,
    // check_in: Date,
    // check_out: Date,
    location: mongoose.Types.ObjectId
});

module.exports = mongoose.model('Hotel', hotelSchema);