const mongoose = require('mongoose');

const PayHistorySchema = new mongoose.Schema({
    Payment_date: {type: Date, required: true},
    price: Number,
    destination_id: [mongoose.Types.ObjectId],
    flight_ids: [mongoose.Types.ObjectId],
    hotel_ids: [mongoose.Types.ObjectId],
    creator_id: {type: mongoose.Types.ObjectId, required: true},
});

module.exports = mongoose.model('PaymentHistory', PayHistorySchema);
