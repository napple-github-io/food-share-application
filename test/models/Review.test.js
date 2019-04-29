require('dotenv').config();
const mongoose = require('mongoose');
const Review = require('../../lib/models/Review');


describe('Review Model', () => {
  const id = new mongoose.Types.ObjectId;

  it('validates a good Review model', () => {
    const review = new Review({
      reviewer: id,
      reviewee: id,
      reviewText: 'super punctual',
      good: true,
    });
   
    expect(review).toEqual({
      reviewer: id,
      reviewee: id,
      reviewText: 'super punctual',
      good: true,
      timestamp: expect.any(String),
      _id: expect.any(mongoose.Types.ObjectId),
      __v: 0
    });
  });
});
