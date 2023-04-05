const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
    name :{
        type: String,
        required:true
    },
    img:{
        data:Buffer,
        contentType: String
    }
});

module.exports = mongoose.model('Photo', photoSchema);