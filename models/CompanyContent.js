const mongoose = require('mongoose');

const ContentSchema = new mongoose.Schema({
  Gr: {
    type: String,
    default: ''
  },
  En: {
    type: String,
    default: ''
  }
});

const CompanyContentSchema = new mongoose.Schema({
  historyTitle: ContentSchema,
  historyDescription: ContentSchema,
});

const CompanyContent = mongoose.model('CompanyContent', CompanyContentSchema);

module.exports = CompanyContent;
