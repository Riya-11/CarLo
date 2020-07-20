const mongoose = require('mongoose');

const rateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  rating: {
    type: String,
    required: true
  },
  review: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});



const rate = mongoose.model('rate', rateSchema);

module.exports = { rate };


