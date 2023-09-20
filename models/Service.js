const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  categoryName: String,
  services: [
    {
      serviceName: String,
      description: String,
    },
  ],
});

module.exports = mongoose.model('Service', ServiceSchema);
