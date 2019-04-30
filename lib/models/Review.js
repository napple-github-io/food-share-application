const mongoose = require('mongoose');
const moment = require('moment');

const reviewSchema = new mongoose.Schema({
  reviewer: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true, 
    // unique: true
  },
  reviewee: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reviewText: {
    type: String, 
    maxlength: 200,
    required: true
  },
  good: {
    type: Boolean,
    required: true
  },
  postedDate: {
    type: String,
    required: true,
    default: moment().format('MMMM Do YYYY, h:mm:ss a')
  } 
},
{
  toJSON: {
    transform: function(doc, ret) {
      delete ret.__v; 
    }
  }
});

module.exports = mongoose.model('Review', reviewSchema);
