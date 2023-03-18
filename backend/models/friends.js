const mongoose = require('mongoose');

const friendsSchema = new mongoose.Schema({
    user1_email: {type: String, required: true},
    user2_email: {type: String, required: true},
    status : {type: String, required: true},
});

module.exports = mongoose.model('Friends', friendsSchema);