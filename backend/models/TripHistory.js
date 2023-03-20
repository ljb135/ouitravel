const mongoose = require('mongoose');

const TripHistorySchema = new mongoose.Schema({
    Start_date: {type: Date, required: true},
    End_date: {type: Date, required: true},
    destination_id: [mongoose.Types.ObjectId],
    hotel_ids: [mongoose.Types.ObjectId],
    creator_id: {type: mongoose.Types.ObjectId, required: true},
});

module.exports = mongoose.model('TripHistory', TripHistorySchema);
