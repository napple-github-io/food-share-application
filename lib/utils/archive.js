const Listing = require('../models/Listing');
// bring in seeddata
// check expiration
// if expiration date is past change archive to true from false (default)

function archive() {
  Listing
    .find()
    .then(console.log());
}
