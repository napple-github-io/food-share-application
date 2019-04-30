require('dotenv').config();
const mongoose = require('mongoose');
const seedData = require('../utils/seed-data');
const archive = require('../../lib/utils/archive');
const User = require('../../lib/models/User');


describe('archive old listings', () => {
  beforeAll(() => {
    return mongoose.connect('mongodb://localhost:27017/napple', {
      useCreateIndex: true,
      useFindAndModify: false,
      useNewUrlParser: true
    });
  });
  
  beforeAll(() => {
    return seedData();
  });
  
  // beforeEach(() => {
  //   return mongoose.connection.dropDatabase();
  // });
  
  afterAll(() => {
    return mongoose.connection.close();
  });

  it('archives old listings', () => {
    return archive();
  });
});
