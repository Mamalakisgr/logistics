const mongoose = require('mongoose');

const RegionOneImageSchema = new mongoose.Schema({
  name: String,
  data: Buffer,
  image: Buffer,
  contentType: String,
  isActive: Boolean // New field
});

module.exports = mongoose.model('RegionOneImage', RegionOneImageSchema);
