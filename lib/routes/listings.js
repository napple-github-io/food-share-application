const Listing = require('../models/Listing');
const User = require('../models/User');
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
    if(req.user.role == 'Admin') {
      return Listing
        .find()
        .select({
          __v: false,
          location: false
        })
        .lean()
        .then(listing => res.send(listing))
        .catch(next);
    } else {
      return Listing
        .find({ archived: false })
        .select({
          __v: false,
          location: false
        })
        .lean()
        .then(listing => res.send(listing))
        .catch(next);
    }
  })
  
  .get('/:id', ensureAuth, (req, res, next) => {
    Listing
      .findById(req.params.id)
      .then(found => {
        if(found.archived == false || req.user._id == found.user || req.user.role == 'Admin'){
          return Listing
            .findById(req.params.id)
            .select({
              __v: false,
              location: false,
            })
            .lean()
            .then(found => res.send(found))
            .catch(next);
        } else {
          const error = new Error('Listing has been archived');
          error.status = 420;
          return next(error);
        }
      });
  })

  .get('/user/:id', (req, res, next) => {
    Listing
      .find({ user: req.params.id, archived: false })
      .lean()
      .then(result => {
        res.send(result);
      })
      .catch(next);
  })

  .patch('/:id', ensureAuth, (req, res, next) => {
    if(req.body.expiration) {
      const error = new Error('Cannot adjust expiration date');
      error.status = 311;
      return next(error);
    }
    Listing
      .findById(req.params.id)
      .then(found => {
        if(req.user._id == found.user || req.user._id == 'Admin'){
          return Listing
            .findByIdAndUpdate(req.params.id, { ...req.body }, { new: true })
            .select({
              __v: false,
              location: false
            })
            .lean()
            .then(updatedListing => res.send(updatedListing))
            .catch(next);
        } else {
          const error = new Error('Unauthorized to edit listing');
          error.status = 420;
          return next(error);
        }
      });

  })

  .delete('/:id', ensureAuth, (req, res, next) => {
    Listing
      .findById(req.params.id)
      .then(found => {
        if(req.user._id == found.user || req.user.role == 'Admin'){
          return Listing
            .findByIdAndUpdate(req.params.id, { archived: true }, { new: true })
            .select({
              _id: true,
              archived: true
            })
            .lean()
            .then(deleted => res.send(deleted))
            .catch(next);
        } else {
          const error = new Error('Unauthorized to delete listing');
          error.status = 420;
          return next(error);
        }
      });
  });
