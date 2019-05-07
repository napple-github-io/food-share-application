const mongoose = require('mongoose');
const moment = require('moment');
const { getZipcodesByRadius } = require('../utils/zipcode-calc');

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
      type: String,
      required: true
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

// move this logic here since it is used in multiple places.
// this removes code duplication.
listingSchema.statics.findByZipRadius = function(zip, radius, extraQuery = {}) {
  return getZipcodesByRadius(zip, radius)
    .then(zipcodes => {
      return this.find({
        archived: false,
        'location.zip': { $in: zipcodes },
        ...extraQuery
      });
    });
};

listingSchema.statics.hotZipcodes = function() {
  return this.aggregate([{
    '$group': {
      '_id': '$location.zip',
      'count': {
        '$sum': 1
      },
      'listings': {
        '$push': {
          'id': '$_id',
          'title': '$title'
        }
      }
    }
  }, {
    '$sort': {
      'count': -1
    }
  }, {
    '$limit': 3
  }, {
    '$project': {
      'zip': '$_id',
      'count': '$count',
      'listings': '$listings',
      '_id': 0
    }
  }]);
};

module.exports = mongoose.model('Listing', listingSchema);
