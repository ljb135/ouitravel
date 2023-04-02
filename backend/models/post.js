const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    trip_id: {type: mongoose.Types.ObjectId},
    creator_id: {type: mongoose.Types.ObjectId, required: true},
    img: 
    {
        data: mongoose.Types.ObjectId,
        type: mongoose.Types.ObjectId
    },
    comment: {type: String}
});

module.exports = mongoose.model('Post', postSchema);