const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    name: String,
    rating: Number,
    price: Number,
    is_indoor: Boolean,
    location: mongoose.Types.ObjectId
});

module.exports = mongoose.model('Activity', activitySchema);