const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: false
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
  },
  location: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['canned goods', 'produce', 'dairy', 'eggs', 'meat', 'seafood', 'cooked foods',
      'garden', 'pantry staples', 'herbs', 'boxed goods', 'spices', 'beverages'],
    required: true
  },
  dietary: {
    dairy: {
      type: Boolean,
      required: true
    },
    gluten: {
      type: Boolean,
      required: false
    },
    shellfish: {
      type: Boolean,
      required: false
    },
    vegetarian: {
      type: Boolean,
      required: false
    },
    vegan: {
      type: Boolean,
      required: false
    },
    nut: {
      type: Boolean,
      required: false
    }
  },
  dateListed: {
    type: Date,
    default: Date.now()
  },
  expiration: {
    type: Date,
    required: false
  }
});

module.exports = mongoose.model('Listing', listingSchema);

