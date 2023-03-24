const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    creator_id: {type: mongoose.Types.ObjectId, required: true},
});

module.exports = mongoose.model('Photo', photoSchema);