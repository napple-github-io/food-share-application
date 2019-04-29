const Listing = require('../models/Listing');
const { ensureAuth } = require('../middleware/ensureAuth');
const { Router } = require('express');

module.exports = Router()
  .post('/', ensureAuth, (req, res, next) => {
    const {
      title,
      user,
      location,
      category,
      dietary,
      dateListed,
      expiration
    } = req.body;

    Listing
      .create({ title, user, location, category, dietary, dateListed, expiration })
      .then(created => res.send(created))
      .catch(next);
  })

  .get('/', ensureAuth, (req, res, next) => {
    Listing
      .find()
      .select({
        __v: false,
        location: false
      })
      .lean()
      .then(listing => res.send(listing))
      .catch(next);
  })
  
;
