const mongoose = require('mongoose');

const companyCountSchema = new mongoose.Schema({
    count: {
      type: Number,
      default: 0
    },
    description: {
      type: String
    }
  });

const CompanyCount = mongoose.model('CompanyCount', companyCountSchema);
module.exports = CompanyCount;
