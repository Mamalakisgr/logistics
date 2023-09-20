const mongoose = require('mongoose');

const seoImageSchema = new mongoose.Schema({
  data: Buffer,
  contentType: String
});

module.exports = mongoose.model('SEOImage', seoImageSchema);
