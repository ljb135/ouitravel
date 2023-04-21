const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    trip_id: {type: mongoose.Types.ObjectId},
    creator_id: {type: mongoose.Types.ObjectId, ref: 'User'},
    comment: {type: String},
    image: {type: Buffer}
});

module.exports = mongoose.model('Post', postSchema);