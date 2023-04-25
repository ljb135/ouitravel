const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    post_id: {type: mongoose.Types.ObjectId},
    creator_id: {type: mongoose.Types.ObjectId, ref: 'User'},
    comment: {type: String},
    creator_name: {type: String}
});

module.exports = mongoose.model('Comment', commentSchema);