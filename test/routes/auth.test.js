require('dotenv').config();
const request = require('supertest');
const app = require('../../lib/app');
const mongoose = require('mongoose');
const seed = require('../utils/seed-data');

describe('auth routes', () => {
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
    email: 'feet@shoes.com',
    location: { address: '1919 NW Quimby St., Portland, Or', zip: '97209' }
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
            location: { address: '1919 NW Quimby St., Portland, Or', zip: '97209' },
            role: 'User',
            powerUser: false
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
                powerUser: false,
                location: { address: '1919 NW Quimby St., Portland, Or', zip: '97209' },
                role: 'User'
              }, token: expect.any(String)
            });
          });
      });
  });

  it('updates a user', () => {
    return request(app)
      .post('/api/v1/auth/signup')
      .send(user)
      .then(createdUser => {
        return request(app)
          .patch(`/api/v1/auth/${createdUser.body.user._id}`)
          .set('Authorization', `Bearer ${createdUser.body.token}`)
          .send({ email: 'poop@poop.com', password: 'newpw', location: { address: '1919 NW Quimby St., Portland, Or', zip: '97209' } })
          .then(res => {
            expect(res.body).toEqual({
              email: 'poop@poop.com', 
              location: { address: '1919 NW Quimby St., Portland, Or', zip: '97209' },
              username: 'wookie',
              role: 'User',
              powerUser: false
            });
          });
      });
  });
  
  it('deletes a user, formally and permanently', () => {
    return request(app)
      .post('/api/v1/auth/signup')
      .send(user)
      .then(createdUser => {
        return request(app)
          .delete(`/api/v1/auth/${createdUser.body.user._id}`)
          .set('Authorization', `Bearer ${createdUser.body.token}`)
         
          .then(deleted => expect(deleted.body).toEqual({ _id: expect.any(String) }));
      });
  });

  it('shows power users', () => {
    return seed()
      .then(() => {
        return request(app)
          .get('/api/v1/auth/power')
          .then(result => {
            expect(result.body[0].count).toBeGreaterThanOrEqual(result.body[2].count);
          });
      });      
  });
});
