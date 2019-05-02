require('dotenv').config();
require('../connect')();
const mongoose = require('mongoose');
const chance = require('chance').Chance();
const User = require('../../models/User');
const Review = require('../../models/Review');
const Listing = require('../../models/Listing');
const moment = require('moment');
const locations = require('./addresses');
const herbs = require('./herbs');


function makeHerbs() {
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
        Promise.all(herbs.map((herb => {
          return Listing.create({
            title: herb,
            user: chance.pickone(createdUsers)._id,
            description: chance.sentence(),
            location:{
              address: chance.pickone(locations).address,
              zip: chance.pickone(locations).zip
            },
            archived: false,
            category: 'herbs',
            dietary: {
              dairy: false,
              gluten: false,
              shellfish: false,
              vegetarian: true,
              vegan: true,
              nut: false
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
    })
    .finally(() => mongoose.connection.close());

}

module.exports = makeHerbs;

