const mongoose = require('mongoose');

const DynamicContentSchema = new mongoose.Schema({
  title: String,
  description: String,
});

const DynamicContent = mongoose.model('DynamicContent', DynamicContentSchema);

module.exports = DynamicContent;