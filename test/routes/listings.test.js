require('dotenv').config();
const request = require('supertest');
const app = require('../../lib/app');
const mongoose = require('mongoose');

describe('auth routes', () => {

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

  // let createdUser = null;

  // const listing = {
  //   title: 'carrots',
  //   user: createdUser.body._id,
  //   location: '555 high st.',
  //   category: 'produce',
  //   dietary: { dairy: true, gluten: true }
  // };

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
            location: '555 high st.',
            category: 'produce',
            dietary: { dairy: true, gluten: true }
          })
          .set('Authorization', `Bearer ${createdUser.body.token}`)
          .then(posted => {
            expect(posted.body).toEqual({
              title: 'carrots',
              user: expect.any(String),
              location: '555 high st.',
              category: 'produce',
              dietary: { dairy: true, gluten: true },
              _id: expect.any(String),
              dateListed: expect.any(String),
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
            location: '555 high st.',
            category: 'produce',
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
});
