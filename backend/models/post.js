const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    trip_id: [mongoose.Types.ObjectId],
    creator_id: {type: mongoose.Types.ObjectId, required: true},
    photo_id: {type: mongoose.Types.ObjectId},
    caption: String
});

module.exports = mongoose.model('Post', postSchema);