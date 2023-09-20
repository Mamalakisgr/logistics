const mongoose = require('mongoose');

const CompanyContentSchema = new mongoose.Schema({
  historyTitle: String,
  historyDescription: String,
  valuesTitle: String,
  valuesDescription: String,
  visionTitle: String,
  visionDescription: String,
});

const CompanyContent = mongoose.model('CompanyContent', CompanyContentSchema);

module.exports = CompanyContent;
