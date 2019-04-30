require('dotenv').config();
const request = require('supertest');
const app = require('../../lib/app');
const User = require('../../lib/models/User');
const mongoose = require('mongoose');

describe('review routes', () => {
  beforeAll(() => {
    return mongoose.connect('mongodb://localhost:27017/nappletest', {
      useCreateIndex: true,
      useFindAndModify: false,
      useNewUrlParser: true
    });
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  const user = {
    username: 'wookie',
    password: 'goobers',
    role: 'User',
    email: 'feet@shoes.com',
    address: '1919 NW Quimby St., Portland, Or 97209'
  };

  it('creates a review', () => {
    return Promise.all([
      User.create(user),
      User.create(user)
    ])
      .then(([reviewer, reviewee]) => {
        return request(app)
          .post('/api/v1/reviews')
          .send({
            reviewer: reviewer._id,
            reviewee: reviewee._id,
            reviewText: 'I am in love with this person',
            good: true
          })
          .then(res => {
            expect(res.body).toEqual({
              reviewer: expect.any(String),
              reviewee: expect.any(String),
              reviewText: 'I am in love with this person',
              good: true,
              _id: expect.any(String),
              createdAt: expect.any(String),
              updatedAt: expect.any(String)
            });
          });
      });
  });

  it('updates a review by id', () => {
    return Promise.all([
      User.create(user),
      User.create(user)
    ])
      .then(([reviewer, reviewee]) => {
        return request(app)
          .post('/api/v1/reviews')
          .send({
            reviewer: reviewer._id,
            reviewee: reviewee._id,
            reviewText: 'I am in love with this person',
            good: true
          })
          .then(createdReview => {
            return request(app)
              .patch(`/api/v1/reviews/${createdReview.body._id}`)
              .send({ reviewText: 'I do not love them anymore', good: false })
              .then(updated => {
                expect(updated.body).toEqual({
                  reviewer: expect.any(String),
                  reviewee: expect.any(String),
                  reviewText: 'I do not love them anymore',
                  good: false,
                  _id: expect.any(String),
                  createdAt: expect.any(String),
                  updatedAt: expect.any(String)
                });
              });
          });
      });
  });

  it('deletes a review by id', () => {
    return Promise.all([
      User.create(user),
      User.create(user)
    ])
      .then(([reviewer, reviewee]) => {
        return request(app)
          .post('/api/v1/reviews')
          .send({
            reviewer: reviewer._id,
            reviewee: reviewee._id,
            reviewText: 'I am in love with this person',
            good: true
          })
          .then(createdReview => {
            return request(app)
              .delete(`/api/v1/reviews/${createdReview.body._id}`)
              .then(res => {
                expect(res.body).toEqual({ _id: expect.any(String) });
              });
          });
      });
  });
});
