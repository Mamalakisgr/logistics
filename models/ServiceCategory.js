const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  categoryName: {
    en: { type: String },
    gr: { type: String }
  },
  services: [
    {
      serviceName: {
        en: { type: String },
        gr: { type: String }
      },
      description: {
        en: { type: String},
        gr: { type: String}
      },
    },
  ],
});

module.exports = mongoose.model('ServiceCategory', ServiceSchema);
