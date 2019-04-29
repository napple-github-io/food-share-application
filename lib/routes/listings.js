const Listing = require('../models/Listing');
const { ensureAuth } = require('../middleware/ensureAuth');
const { Router } = require('express');

module.exports = Router()
  .post('/', (req, res, next) => {
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
  });
