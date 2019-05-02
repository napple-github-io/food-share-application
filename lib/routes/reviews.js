const { Router } = require('express');
const Review = require('../models/Review');
const { ensureAuth } = require('../../lib/middleware/ensureAuth');

module.exports = Router()
  .post('/', ensureAuth, (req, res, next) => {
    const {
      reviewer,
      reviewee,
      reviewText,
      good
    } = req.body;

    Review
      .create({ reviewer, reviewee, reviewText, good })
      .then(review => res.send(review))
      .catch(next);
  })
  
  .patch('/:id', ensureAuth, (req, res, next) => {

    Review
      .findById(req.params.id)
      .then(found => {
        if(req.user._id == found.reviewer || req.user.role == 'Admin'){
          return Review
            .findByIdAndUpdate(req.params.id, { ...req.body }, { new: true })
            .select({ __v: false })
            .lean()
            .then(updated => res.send(updated))
            .catch(next);
        } else {
          const error = new Error('Unauthorized to edit review');
          error.status = 420;
          return next(error);
        }
      });
  })
  
  .delete('/:id', ensureAuth, (req, res, next) => {
    Review
      .findById(req.params.id)
      .then(foundReview => {
        if(req.user._id == foundReview.reviewer || req.user.role == 'Admin'){
          return Review
            .findByIdAndDelete(req.params.id)
            .select({ _id: true })
            .lean()
            .then(deleted => res.send(deleted))
            .catch(next);
        } else {
          const error = new Error('Unauthorized to delete review');
          error.status = 420;
          return next(error);
        }
      });
  })

  .get('/user/:id', (req, res, next) => {
    Review
      .find({ reviewee: req.params.id })
      .select({
        __v: false
      })
      .lean()
      .then(reviewsOfUser => res.send(reviewsOfUser))
      .catch(next);
  });
