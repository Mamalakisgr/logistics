const mongoose = require('mongoose');

// Schema for multilingual Team Section
const teamSectionSchema = new mongoose.Schema({
  title_en: { // English title
    type: String,
    required: true
  },
  description_en: { // English description
    type: String,
    required: true
  },
  title_gr: { // Greek title
    type: String,
    required: true
  },
  description_gr: { // Greek description
    type: String,
    required: true
  }
  // Add more fields here if needed, like team members
});

// Creating models
const TeamSection = mongoose.model('TeamSection', teamSectionSchema);

// Exporting the models
module.exports = {TeamSection };
