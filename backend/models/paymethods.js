// importing mongoose in node.js
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    card_number: {type: Number, unique: true, required: true},
    card_holder_name: {type: String, required: true},
    owner_email: {type: String, required: true},
    expiration_date: {type: Date, required: true},
    cvv: {type: Number, required: true}
});

module.exports = mongoose.model('PayMethod', paymentSchema);