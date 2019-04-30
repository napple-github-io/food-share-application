require('dotenv').config();
const request = require('supertest');
const app = require('../../lib/app');
const mongoose = require('mongoose');

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
    role: 'User',
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
            address: '1919 NW Quimby St., Portland, Or 97209',
            role: 'User'
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
                address: '1919 NW Quimby St., Portland, Or 97209',
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
          .send({ email: 'poop@poop.com', password: 'newpw', address: '555 high street, eugene, Or 97362' })
          .then(res => {
            expect(res.body).toEqual({
              email: 'poop@poop.com', 
              address: '555 high street, eugene, Or 97362',
              username: 'wookie',
              role: 'User'
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
  //when a user is deleted,
  //all listings that refer to it are ---ARCHIVED---
});
