require('dotenv').config();
const mongoose = require('mongoose');
const seedData = require('../utils/seed-data');
const archive = require('../../lib/utils/archive');
const Listing = require('../../lib/models/Listing');


describe('archive old listings', () => {
  beforeAll(() => {
    return mongoose.connect('mongodb://localhost:27017/napple', {
      useCreateIndex: true,
      useFindAndModify: false,
      useNewUrlParser: true
    });
  });
  
  afterAll(() => {
    return mongoose.connection.close();
  });

  it('archives old listings', () => {
    return seedData()
      .then(() => {
        return archive();
      })
      .then(() => {
        return Listing
          .findOne()
          .then(listing => {
            expect(listing.archived).toBeTruthy();
          });
      });
  });
});
