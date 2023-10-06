const mongoose = require('mongoose');

const ServiceDetailSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    }
});

module.exports = mongoose.model('ServiceDetail', ServiceDetailSchema);