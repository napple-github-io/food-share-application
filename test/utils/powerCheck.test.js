require('dotenv').config();
const mongoose = require('mongoose');
const seedData = require('../utils/seed-data');
const powerCheck = require('../../lib/utils/powerCheck');
const User = require('../../lib/models/User');


describe('Powercheck', () => {
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

  it('checks power users', () => {
    return seedData()
      .then(() => {
        return powerCheck()
          .then(() => {
            return User
              .find();
          });
      });
  });
});
