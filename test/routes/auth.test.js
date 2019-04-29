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
    email: 'feet@shoes.com',
    address: '1919 NW Quimby St., Portland, Or 97209'
  };

  it('signs up a user', () => {
    return request(app)
      .post('/api/v1/auth/signup')
      .send(user)
      .then(createdUser => {
        expect(createdUser.body).toEqual({
          user: {
            username: 'wookie',
            _id: expect.any(String),
            email: 'feet@shoes.com',
            address: '1919 NW Quimby St., Portland, Or 97209'
          }, token: expect.any(String)
        });
      });
  });

  it('sign in', () => {
    return request(app)
      .post('/api/v1/auth/signup')
      .send(user)
      .then(() => {
        return request(app)
          .post('/api/v1/auth/signin')
          .send({ username: 'wookie', password: 'goobers' })
          .then(foundUser => {
            expect(foundUser.body).toEqual({
              user: {
                username: 'wookie',
                _id: expect.any(String),
                email: 'feet@shoes.com',
                address: '1919 NW Quimby St., Portland, Or 97209'
              }, token: expect.any(String)
            });
          });
      });
  });
  
});
