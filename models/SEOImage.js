const mongoose = require('mongoose');

const seoImageSchema = new mongoose.Schema({
  name: String,
  data: Buffer,
  image: Buffer,
  contentType: String,
  isActive: { type: Boolean, default: false }  // New field
});

module.exports = mongoose.model('SEOImage', seoImageSchema);
