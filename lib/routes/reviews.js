const { Router } = require('express');
const Review = require('../models/Review');
const { bearerToken, ensureAuth } = require('../../lib/middleware/ensureAuth');

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
      .findByIdAndUpdate(req.params.id, { ...req.body }, { new: true })
      .select({ __v: false })
      .lean()
      .then(updated => res.send(updated))
      .catch(next);
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
  });
