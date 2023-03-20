const mongoose = require('mongoose');

const postScema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    trip_id: [mongoose.Types.ObjectId],
    creator_id: {type: mongoose.Types.ObjectId, required: true},
    photo_id: {type: mongoose.Types.ObjectId},
    comment: String
});

module.exports = mongoose.model('Post', postSchema);