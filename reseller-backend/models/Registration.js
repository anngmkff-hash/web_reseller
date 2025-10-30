// models/Registration.js
const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  whatsapp: { type: String, required: true },
  city: { type: String, required: true }
}, { timestamps: true }); // otomatis nambah createdAt dan updatedAt

module.exports = mongoose.model('Registration', registrationSchema);
