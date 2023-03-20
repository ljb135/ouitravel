const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    name: String,
    country: String,
    rating: Number
});

module.exports = mongoose.model('Location', locationSchema);