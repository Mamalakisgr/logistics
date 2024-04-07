const mongoose = require('mongoose');

const ServiceDetailSchema = new mongoose.Schema({
    title: {
        en: { type: String },
        gr: { type: String }
      },
    description: {
        en: { type: String },
        gr: { type: String }
    }
});

module.exports = mongoose.model('ServiceDetail', ServiceDetailSchema);