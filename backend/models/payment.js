const mongoose = require('mongoose');

const PaySchema = new mongoose.Schema({
    price: Number,
    creator_id: {type: mongoose.Types.ObjectId, required: true},
    trip_id: {type: mongoose.Types.ObjectId, required: true},
    date: {type: Date, required: true}
});

module.exports = mongoose.model('Payment', PaySchema);

//extremely barebones on purpose, will be fleshed out later by other team members.
