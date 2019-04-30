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
  });
