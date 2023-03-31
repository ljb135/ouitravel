const mongoose = require('mongoose');

//test
const tripSchema = new mongoose.Schema({
    status: {type: String, required: true},
    visibility: {type: String, required: true},
    start_date: {type: Date, required: true},
    end_date: {type: Date, required: true},
    destination_id: [mongoose.Types.ObjectId],
    flight_ids: [mongoose.Types.ObjectId],
    hotel_ids: [mongoose.Types.ObjectId],
    activity_ids: [mongoose.Types.ObjectId],
    creator_id: {type: mongoose.Types.ObjectId, required: true},
    collaborator_ids: [mongoose.Types.ObjectId]
});

module.exports = mongoose.model('Trip', tripSchema);