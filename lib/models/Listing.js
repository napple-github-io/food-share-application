const mongoose = require('mongoose');
const moment = require('moment');

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
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
    address: {
      type: String,
      required: true
    },
    zip: {
      type: Number,
      required:true
    }
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
      required: false
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
  postedDate: {
    type: String,
    required: true,
    default: moment().format('MMMM Do YYYY, h:mm:ss a')
  },
  expiration: {
    type: String,
    required: true,
    default: moment().add(2, 'days').format('MMMM Do YYYY, h:mm:ss a')
  },
  archived: {
    type: Boolean,
    required: true,
    default: false
  }
});

module.exports = mongoose.model('Listing', listingSchema);

