const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    name: {
        gr: String,
        en: String
      },
      title: {
        gr: String,
        en: String
      },
      data: Buffer,
      image: Buffer,
    store: String,
    contentType: String

});

module.exports = mongoose.model('EmployeeSchema', employeeSchema);
