const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    trip_id: {type: mongoose.Types.ObjectId},
    creator_id: {type: mongoose.Types.ObjectId, required: true},
    photo_id: {type: mongoose.Types.ObjectId},
    comment: {type: String}
});

module.exports = mongoose.model('Post', postSchema);