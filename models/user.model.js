const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  profilePhoto: {
    type: String,
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
  accountStatus: {
    type: String,
    enum: ['VERIFIED', 'PENDING','UNVERIFIED'],
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
