const mongoose = require('mongoose');

const SEOContentSchema = new mongoose.Schema({
  title: {
    gr: String,
    en: String
  },
  description: {
    gr: String,
    en: String
  },
  imagePath: String,  // Path where the image is stored
  contentType: String // Image mime type
});


module.exports = mongoose.model('SEOContent', SEOContentSchema);