require('dotenv').config();
const mongoose = require('mongoose');
const seedData = require('../utils/seed-data');
const powerCheck = require('../../lib/utils/powerCheck');
const Review = require('../../lib/models/Review');


describe('Check user rating', () => {
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

  // it('archives old listings', () => {
  //   return seedData()
  //     .then(() => {
  //       return powerCheck()
  //         .then(() => {
  //           return User
  //             .find();
  //         });
  //     });
  // });
});
