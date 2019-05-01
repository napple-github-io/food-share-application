require('dotenv').config();
const request = require('supertest');
const app = require('../../lib/app');
const mongoose = require('mongoose');


describe('listings routes', () => {

  beforeAll(() => {
    return mongoose.connect('mongodb://localhost:27017/napple', {
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
    location: {
      address: '1919 NW Quimby St., Portland, Or',
      zip: '97209'
    }
  };

  it('creates a listing after user', () => {
    return request(app)
      .post('/api/v1/auth/signup')
      .send(user)
      .then(createdUser => {
        return request(app)
          .post('/api/v1/listings')
          .send({
            title: 'carrots',
            user: createdUser.body.user._id,
            location: { address: '1919 NW Quimby St., Portland, Or', zip: '97209' },
            category: 'produce',
            dietary: { dairy: true, gluten: true }
          })
          .set('Authorization', `Bearer ${createdUser.body.token}`)
          .then(posted => {
            expect(posted.body).toEqual({
              title: 'carrots',
              user: expect.any(String),
              location: { address: '1919 NW Quimby St., Portland, Or', zip: '97209' },              category: 'produce',
              dietary: { dairy: true, gluten: true },
              _id: expect.any(String),
              postedDate: expect.any(String),
              expiration: expect.any(String),
              archived: false,
              __v: 0
            });
          });
      });
  });

  it('gets a list of listings', () => {
    return request(app)
      .post('/api/v1/auth/signup')
      .send(user)
      .then(createdUser => {
        return request(app)
          .post('/api/v1/listings')
          .send({
            title: 'carrots',
            user: createdUser.body.user._id,
            location: { address: '1919 NW Quimby St., Portland, Or', zip: '97209' },            category: 'produce',
            dietary: { dairy: true, gluten: true }
          })
          .set('Authorization', `Bearer ${createdUser.body.token}`)
          .then(() => {
            return request(app)
              .get('/api/v1/listings')
              .set('Authorization', `Bearer ${createdUser.body.token}`)
              .then(list => {
                expect(list.body).toHaveLength(1);
              });
          });
      });
  });

  it('gets by id', () => {
    return request(app)
      .post('/api/v1/auth/signup')
      .send(user)
      .then(createdUser => {
        return request(app)
          .post('/api/v1/listings')
          .send({
            title: 'carrots',
            user: createdUser.body.user._id,
            location: { address: '1919 NW Quimby St., Portland, Or', zip: '97209' },            category: 'produce',
            dietary: { dairy: true, gluten: true }
          })
          .set('Authorization', `Bearer ${createdUser.body.token}`)
          .then(listing => {
            return request(app)
              .get(`/api/v1/listings/${listing.body._id}`)
              .set('Authorization', `Bearer ${createdUser.body.token}`)
              .then(listing => {
                expect(listing.body).toEqual({
                  title: 'carrots',
                  user: createdUser.body.user._id,
                  category: 'produce',
                  dietary: { dairy: true, gluten: true },
                  _id: expect.any(String),
                  postedDate: expect.any(String),
                  expiration: expect.any(String),
                  archived: false
                });
              });
          });
      });
  });

  it('patches by id', () => {
    return request(app)
      .post('/api/v1/auth/signup')
      .send(user)
      .then(createdUser => {
        return request(app)
          .post('/api/v1/listings')
          .send({
            title: 'carrots',
            user: createdUser.body.user._id,
            location: { address: '1919 NW Quimby St., Portland, Or', zip: '97209' },            category: 'produce',
            dietary: { dairy: true, gluten: true }
          })
          .set('Authorization', `Bearer ${createdUser.body.token}`)
          .then(listing => {
            return request(app)
              .patch(`/api/v1/listings/${listing.body._id}`)
              .set('Authorization', `Bearer ${createdUser.body.token}`)
              .send({ title: 'ham', dietary: { dairy: false, gluten: true }, category: 'meat' })
              .then(listing => {
                expect(listing.body).toEqual({
                  title: 'ham',
                  user: createdUser.body.user._id,
                  category: 'meat',
                  dietary: { dairy: false, gluten: true },
                  _id: expect.any(String),
                  postedDate: expect.any(String),
                  expiration: expect.any(String),
                  archived: false
                });
              });
          });
      });
  });

  it('deletes by id', () => {
    return request(app)
      .post('/api/v1/auth/signup')
      .send(user)
      .then(createdUser => {
        return request(app)
          .post('/api/v1/listings')
          .send({
            title: 'carrots',
            user: createdUser.body.user._id,
            location: { address: '1919 NW Quimby St., Portland, Or', zip: '97209' },            category: 'produce',
            dietary: { dairy: true, gluten: true }
          })
          .set('Authorization', `Bearer ${createdUser.body.token}`)
          .then(listing => {
            return request(app)
              .delete(`/api/v1/listings/${listing.body._id}`)
              .set('Authorization', `Bearer ${createdUser.body.token}`)
              .then(deleted => {
                expect(deleted.body._id).toEqual(listing.body._id);
                expect(deleted.body.archived).toEqual(true);
              });
          });
      });
  });

  it('rejects attempt to patch expiration', () => {
    return request(app)
      .post('/api/v1/auth/signup')
      .send(user)
      .then(createdUser => {
        return request(app)
          .post('/api/v1/listings')
          .send({
            title: 'carrots',
            user: createdUser.body.user._id,
            location: { address: '1919 NW Quimby St., Portland, Or', zip: '97209' },            category: 'produce',
            dietary: { dairy: true, gluten: true }
          })
          .set('Authorization', `Bearer ${createdUser.body.token}`)
          .then(listing => {
            return request(app)
              .patch(`/api/v1/listings/${listing.body._id}`)
              .set('Authorization', `Bearer ${createdUser.body.token}`)
              .send({ expiration: 'should reject' })
              .then(listing => {
                expect(listing.body.error).toEqual('Cannot adjust expiration date');
              });
          });
      });
  });
});
