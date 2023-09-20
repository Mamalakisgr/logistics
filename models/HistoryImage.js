const mongoose = require('mongoose');

const historyImageSchema = new mongoose.Schema({
  name: String,
  data: Buffer,
  image: Buffer,
  contentType: String
});

module.exports = mongoose.model('HistoryImage', historyImageSchema);


