const Listing = require('../models/Listing');
const moment = require('moment');

// check expiration
// if expiration date is past change archive to true from false (default)

function archive() {
  const now = moment().format('MMMM Do YYYY, h:mm:ss a');
  return Listing
    .find()
    .then(list => {
      list.map(listing => {
        if(now < listing.expiration) {
          listing.archived = true;
          console.log(listing.archived);
        }
      });
    });
}

module.exports = archive;
