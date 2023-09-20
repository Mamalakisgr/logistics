const mongoose = require('mongoose');

const SEOContentSchema = new mongoose.Schema({
  title: String,
  description: String,

});

module.exports = mongoose.model('SEOContent', SEOContentSchema);