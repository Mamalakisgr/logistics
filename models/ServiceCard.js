const mongoose = require('mongoose');

const ServiceCardSchema = new mongoose.Schema({
  title: {
    gr: String,
    en: String
  },
  description: {
    gr: String,
    en: String
  }
});

const ServiceCard = mongoose.model('ServiceCard', ServiceCardSchema);

module.exports = ServiceCard;
