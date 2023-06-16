const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  profilePhoto: {
    type: Array,
    required: true,
  },
  names: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true,
  },
  age: {
    type: Number,
    required: true,
    min: 12,
    max: 120,
  },
  verificationStatus: {
    type: String,
    enum: ['UNVERIFIED', 'PENDING VERIFICATION', 'VERIFIED'],
    default: 'UNVERIFIED',
  },

  token:String,
 
  birthdate: {
    type: Date,
    required: true,
  },
  maritalStatus: {
    type: String,
    enum: ['Single', 'Married', 'Divorced', 'Widowed'],
    required: true,
  },
  nationality: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  email:{
    type:String,
    unique: true,
  },

  documentType: {
    type: String,
    enum:['NID','Passport'],
  },
  document: {
    type: Array,
  },


});

const User = mongoose.model('User', userSchema);

module.exports = User;
