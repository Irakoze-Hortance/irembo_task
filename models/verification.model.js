const mongoose = require('mongoose');

const verificationSchema = new mongoose.Schema({
  documentType: {
    type: String,
    enum:['NID','Passport'],
    required: true,
  },
  document: {
    type: Array,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const Verification = mongoose.model('Verification', verificationSchema);

module.exports = Verification;
