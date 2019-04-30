const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const reviewSchema = new mongoose.Schema({
  reviewer: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true, 
    unique: true

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
  }
},
{
  toJSON: {
    transform: function(doc, ret) {
      delete ret.__v; 
    }
  }
});

reviewSchema.plugin(timestamp);
module.exports = mongoose.model('Review', reviewSchema);
