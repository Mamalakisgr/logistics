const mongoose = require('mongoose');

const valuesImageSchema = new mongoose.Schema({
  name: String,
  data: Buffer,
  image: Buffer,
  contentType: String
});

module.exports = mongoose.model('ValuesImage', valuesImageSchema);

