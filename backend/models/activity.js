const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    _id: String,
    name: String,
    rating: Number,
    description: String,
    duration: Number,
    price: Number,
    longitude: Number,
    latitude: Number
});

module.exports = mongoose.model('Activity', activitySchema);