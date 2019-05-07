const { Router } = require('express');
const Listing = require('../models/Listing');
const makeData = require('../utils/pdx-data/presentation-data');
const makeHerbs = require('../utils/pdx-data/makeHerbs');
const { ensureAuth } = require('../middleware/ensureAuth');
const { getZipcodesByRadius } = require('../utils/zipcode-calc');
const { getDistanceByAddress, getDistanceByZip, getListingMap } = require('../utils/distance-calc');
const booleanQuery = require('../utils/boolean-query');

module.exports = Router()
  .post('/', ensureAuth, (req, res, next) => {
    const {
      title,
      user,
      location,
      category,
      dietary,
      dateListed,
      expiration
    } = req.body;

    Listing
      .create({ title, user, location, category, dietary, dateListed, expiration })
      .then(created => res.send(created))
      .catch(next);
  })

  .get('/hotzips', (req, res, next) => {
    Listing
      .hotZipcodes()
      .then(zips => res.send(zips))
      .catch(next);
  })

  .get('/', (req, res, next) => {
    return Listing
      .find({ archived: false })
      .select({
        __v: false,
        location: false
      })
      .lean()
      .then(listings => res.send(listings))
      .catch(next);
  })

  .get('/archived', ensureAuth, (req, res, next) => {
    if(req.user.role == 'Admin') {
      return Listing
        .find({ archived: true })
        .select({
          __v: false,
          location: false
        })
        .lean()
        .then(listing => res.send(listing))
        .catch(next);
    } else {
      const error = new Error('Administrative Access Only');
      error.status = 420;
      return next(error);
    }
  })

  .get('/close', ensureAuth, (req, res, next) => { //edited to get map too... maybe
    // Get a list of close zipcodes using https://www.zipcodeapi.com/API#matchClose
    Listing
      .findByZipRadius(req.user.location.zip, req.query.radiusInMiles)
      .then(list => {
        return Promise.all(list.map(listing => {
          // this is very expensive. You have to make one API call for every listing.
          // This won't scale as your application gets bigger. Maybe first getting
          // a list of closest zipcodes then get distance.
          return getDistanceByAddress(req.user.location, listing.location);
        })).then(distances => {
          return distances.map((distance, i) => {
            return { _id: list[i]._id, distance };
          });
        });
      })
      .then((activeListings) => {
        return activeListings.filter(listing => {
          return listing.distance <= req.query.radiusInMiles;
        });
      })
      .then(closest => {
        // Get all listings at once instead of one at a time
        // this will improve performance.
        return Listing.find({
          _id: { $in: closest.map(({ _id }) => _id) }
        });
      })
      .then(matches => {
        const addresses = matches.map(match => (match.location.address)).join('|');
        res.send({
          url: getListingMap(req.user.location.address, addresses),
          matches
        });
      })
      .catch(next);
  })

  .get('/close/zip', (req, res, next) => {
    Listing
      .findByZipRadius(req.user.location.zip, req.query.radiusInMiles)
      .then(matches => {
        const addresses = matches.map(match => (match.location.address)).join('|');
        res.send({
          url: getListingMap(req.query.zip, addresses),
          matches
        });
      })
      .catch(next);
  })

  .get('/dietary', (req, res, next) => {
    const searchObject = booleanQuery(req.query, 'dietary.');
    Listing
      .find(searchObject)
      .select({
        __v: false
      })
      .lean()
      .then(foundListings => res.send(foundListings))
      .catch(next);
  })

  .get('/dietary/close', (req, res, next) => {
    const closeSearchObject = booleanQuery(req.query, 'dietary.');
    Listing
      .findByZipRadius(req.user.location.zip, req.query.radiusInMiles, closeSearchObject)
      .then(foundListings => res.send(foundListings))
      .catch(next);
  })

  .get('/keyword', (req, res, next) => {
    let regex = new RegExp(req.query.searchTerm, 'i');
    Listing
      .find({
        title: regex,
        archived: false
      })
      .select({
        __v: false
      })
      .lean()
      .then(foundListings => res.send(foundListings))
      .catch(next);
  })

  .get('/keyword/close', (req, res, next) => {
    let regex = new RegExp(req.query.searchTerm, 'i');
    Listing
      .findByZipRadius(req.user.location.zip, req.query.radiusInMiles, { title: regex })
      .then(matches => {
        const addresses = matches.map(match => (match.location.address)).join('|');
        res.send({
          url: getListingMap(req.query.zip, addresses),
          matches
        });
      })
      .catch(next);
  })

  .get('/:id', ensureAuth, (req, res, next) => {
    Listing
      .findById(req.params.id)
      .select({
        __v: false,
        location: false,
      })
      .lean()
      .then(found => {
        if(found.archived === false || req.user._id === found.user || req.user.role === 'Admin') {
          // no need to fetch the document again.
          res.send(found);
        } else {
          const error = new Error('Listing has been archived');
          error.status = 420;
          return next(error);
        }
      });
  })

  .get('/user/:id', (req, res, next) => {
    Listing
      .find({ user: req.params.id, archived: false })
      .lean()
      .then(result => {
        res.send(result);
      })
      .catch(next);
  })

  .get('/zip/:zip', (req, res, next) => {
    Listing
      .find({ 'location.zip': req.params.zip, archived: false })
      .lean()
      .then(result => {
        res.send(result);
      })
      .catch(next);
  })


  .patch('/:id', ensureAuth, (req, res, next) => {
    if(req.body.expiration) {
      const error = new Error('Cannot adjust expiration date');
      error.status = 311;
      return next(error);
    }
    let query = { _id: req.params.id };
    if(!req.user.role === 'Admin') {
      query.user = req.user._id;
    }

    // using findOneAndUpdate simplifies the logic here
    Listing
      .findOneAndUpdate(query, { ...req.body }, { new: true })
      .select({
        __v: false,
        location: false
      })
      .lean()
      .then(updatedListing => res.send(updatedListing))
      .catch(next);
  })

  .delete('/:id', ensureAuth, (req, res, next) => {
    let query = { _id: req.params.id };
    if(!req.user.role === 'Admin') {
      query.user = req.user._id;
    }

    // using findOneAndUpdate simplifies the logic here
    Listing
      .findOneAndUpdate(query, { archived: true }, { new: true })
      .select({
        _id: true,
        archived: true
      })
      .lean()
      .then(deleted => res.send(deleted))
      .catch(next);
  })

  .get('/admin/populate', ensureAuth, (req, res, next) => {
    // need to make sure you have an admin here
    makeData()
      .catch(next);
  })

  .get('/admin/herbs', ensureAuth, (req, res, next) => {
    // need to make sure you have an admin here
    makeHerbs()
      .catch(next);
  });
