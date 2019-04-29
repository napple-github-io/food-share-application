require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../../lib/models/User');

describe('User model', () =>{

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

  const user = new User({
    username: 'wookie',
    password: 'goobers',
    email: 'feet@shoes.com',
    address: '1919 NW Quimby St., Portland, Or 97209'
  });

  it('has a username, email password and address', () => {
    expect(user.toJSON()).toEqual({
      username: 'wookie',
      email: 'feet@shoes.com',
      address: '1919 NW Quimby St., Portland, Or 97209',
      _id: expect.any(mongoose.Types.ObjectId)
    });
  });

  it('returns with a passwordHash', () => {
    expect(user._tempPassword).toEqual('goobers');
  });

  it('compares a good password', () => {
    return User.create({
      username: 'wookie',
      password: 'goobers',
      email: 'feet@shoes.com',
      address: '1919 NW Quimby St., Portland, Or 97209'
    })
      .then(created => {
        return created.compare('goobers');
      })
      .then(result => {
        expect(result).toBeTruthy();
      });
  });

  it('compares a good password', () => {
    return User.create({
      username: 'wookie',
      password: 'goobers',
      email: 'feet@shoes.com',
      address: '1919 NW Quimby St., Portland, Or 97209'
    })
      .then(created => {
        return created.compare('bananas');
      })
      .then(result => {
        expect(result).toBeFalsy();
      });
  });


});
