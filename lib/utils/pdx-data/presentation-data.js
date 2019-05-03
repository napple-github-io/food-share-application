const chance = require('chance').Chance();
const User = require('../../models/User');
const Review = require('../../models/Review');
const Listing = require('../../models/Listing');
const moment = require('moment');
const locations = require('./addresses');
const titles = require('./titles');

function makeData() {
  return Promise.all(
    locations.map((banana) => {
      return User.create({
        username: chance.word({ syllables: 3 }),
        password: chance.word({ syllables: 2 }),
        email: chance.email(),
        location: {
          address: banana.address,
          zip: banana.zip
        },
        role: 'User'
      });
    })
  )
    .then((createdUsers) => {
      return Promise.all([
        Promise.all(titles.map((title => {
          return Listing.create({
            title: title,
            user: chance.pickone(createdUsers)._id,
            description: chance.sentence(),
            location:{
              address: chance.pickone(locations).address,
              zip: chance.pickone(locations).zip
            },
            archived: false,
            category: chance.pickone(['canned goods', 'produce', 'dairy', 'eggs', 'meat', 'seafood', 'cooked foods', 'garden', 'pantry staples', 'herbs', 'boxed goods', 'spices', 'beverages']),
            dietary: {
              dairy: chance.bool({ likelihood: 20 }),
              gluten: chance.bool({ likelihood: 25 }),
              shellfish: chance.bool({ likelihood: 10 }),
              vegetarian: chance.bool({ likelihood: 50 }),
              vegan: chance.bool({ likelihood: 20 }),
              nut: chance.bool({ likelihood: 25 })
            },
            postedDate: moment().format('MMMM Do YYYY, h:mm:ss a'),
            expiration: moment().add(2, 'days').format('MMMM Do YYYY, h:mm:ss a')
          });
        }))),
        Promise.resolve(createdUsers) 
      ]);
    })
    /*eslint-disable no-unused-vars*/
    .then(([listings, createdUsers]) => {
      return Promise.all(createdUsers.map((user) => {
        return Review.create({
          reviewer: user._id,
          reviewee: chance.pickone(createdUsers)._id,
          reviewText: chance.sentence(),
          good: chance.bool()
        });
      }));
    });
}
module.exports = makeData;
