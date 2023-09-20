const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    name: String,
    data: Buffer,
    image: Buffer,
    contentType: String
  });
  module.exports = mongoose.model('Banner', bannerSchema);
