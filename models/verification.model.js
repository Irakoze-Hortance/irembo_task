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
  verificationStatus: {
    type: String,
    enum: ['UNVERIFIED', 'PENDING VERIFICATION', 'VERIFIED'],
    default: 'UNVERIFIED',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const Verification = mongoose.model('Verification', verificationSchema);

module.exports = Verification;
