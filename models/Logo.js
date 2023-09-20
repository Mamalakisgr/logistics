const mongoose = require('mongoose');

const LogoSchema = new mongoose.Schema({
  name: String, // You can use this to identify each logo
  data: Buffer,
  contentType: String,
  isActive: Boolean, // New field
});
module.exports = mongoose.model('Logo', LogoSchema);
