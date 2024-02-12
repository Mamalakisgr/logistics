const mongoose = require('mongoose');

// Schema for multilingual Store Section
const storeSection = new mongoose.Schema({
  title: {
    gr: String,
    en: String
  },
  description: {
    gr: String,
    en: String
  }
});

module.exports = mongoose.model('StoreSection', storeSection);
