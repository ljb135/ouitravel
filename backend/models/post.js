const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    trip_id: {type: mongoose.Types.ObjectId},
    creator_id: {type: mongoose.Types.ObjectId, required: true},
    photo_id: {type: mongoose.Types.ObjectId},
<<<<<<< HEAD
    caption: String
=======
    comment: {type: String}
>>>>>>> 88a71efb34e3b6480a91ae6f0bdb474d5bc75c2f
});

module.exports = mongoose.model('Post', postSchema);