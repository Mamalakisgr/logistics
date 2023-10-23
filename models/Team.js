const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    teamHeader: {
        gr: String,
        en: String
      },
      teamDescription: {
        gr: String,
        en: String
      },
      data: Buffer,
      image: Buffer

});

module.exports = mongoose.model('TeamSchema', teamSchema);
