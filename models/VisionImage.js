const mongoose = require('mongoose');

const visionImageSchema = new mongoose.Schema({
  name: String,
  data: Buffer,
  image: Buffer,
  contentType: String
});

module.exports = mongoose.model('VisionImage', visionImageSchema);

