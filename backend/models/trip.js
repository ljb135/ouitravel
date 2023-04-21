
const mongoose = require('mongoose');

//test
const tripSchema = new mongoose.Schema({
    status: {type: String, required: true},
    visibility: {type: String, required: true},
    start_date: {type: Date, required: true},
    end_date: {type: Date, required: true},
    destination_id: {type: String,  required: true},
    destination_name: {type: String,  required: true},
    flight_ids: [String],
    hotel_ids: [String],
    activity_ids: [String],
    creator_id: {type: mongoose.Types.ObjectId, required: true},
    collaborator_ids: [mongoose.Types.ObjectId],
    price: {type: Number, required: true},
    paid_date: Date
});

module.exports = mongoose.model('Trip', tripSchema);

//test