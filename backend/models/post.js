const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    trip_id: {type: mongoose.Types.ObjectId},
    creator_id: {type: mongoose.Types.ObjectId, ref: 'User'},
    caption: {type: String},
    image: {type: Buffer},
    creator_name: {type: String},
    creator_email: {type: String}
});

module.exports = mongoose.model('Post', postSchema);