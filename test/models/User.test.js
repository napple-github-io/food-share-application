require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../../lib/models/User');

describe('User model', () =>{
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

});
