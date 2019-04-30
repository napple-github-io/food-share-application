const { Router } = require('express');
const Review = require('../models/Review');

module.exports = Router()
  .post('/', (req, res, next) => {
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
  
  .patch('/:id', (req, res, next) => {
    Review
      .findByIdAndUpdate(req.params.id, { ...req.body }, { new: true })
      .select({ __v: false })
      .lean()
      .then(updated => res.send(updated))
      .catch(next);
  })
  
  .delete('/:id', (req, res, next) => {
    Review
      .findByIdAndDelete(req.params.id)
      .select({ _id: true })
      .lean()
      .then(deleted => res.send(deleted))
      .catch(next);
  });
