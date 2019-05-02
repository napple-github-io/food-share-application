const User = require('../models/User');
const { ensureAuth } = require('../middleware/ensureAuth');
const { Router } = require('express');

module.exports = Router()
  .post('/signup', (req, res, next) => {
    const {
      username,
      email,
      password, 
      location
    } = req.body;

    User
      .create({ username, email, password, location })
      .then(user => {
        const token = user.authToken();
        res.send({ user, token });
      })
      .catch(next);
  })

  .post('/signin', (req, res, next) => {
    const {
      username,
      password } = req.body;

    User
      .findOne({ username })
      .then(foundUser => {
        if(!foundUser){
          const error = new Error('Invalid Auth');
          error.status = 401;
          next(error);
        } 
        return Promise.all([
          Promise.resolve(foundUser),
          foundUser.compare(password)
        ]);
      })
      .then(([user, result]) => {
        if(!result) {
          const error = new Error('Invalid Auth');
          error.status = 401;
          next(error);
        } else {
          res.send({ token: user.authToken(), user });
        }
      });
  })
  
  .get('/verify', ensureAuth, (req, res, next) => {
    res.send(req.user);
    next();
  })

  .get('/usersearch/:id', ensureAuth, (req, res, next) => {
    User
      .findById(req.params.id)
      .then(user => res.send(user))
      .catch(next);
  })

  .get('/power', (req, res, next) => {
    User
      .getPowerUsers()
      .then(posts => res.send(posts))
      .catch(next);
  })

  .patch('/:id', ensureAuth, (req, res, next) => {
    User
      .findByIdAndUpdate(req.params.id, { ...req.body }, { new: true })
      .select({
        _id: false,
        __v: false,
        passwordHash: false
      })
      .lean()
      .then(updatedUser => res.send(updatedUser))
      .catch(next);
  })

  .delete('/:id', ensureAuth, (req, res, next) => {
    User
      .findByIdAndDelete(req.params.id)
      .select({ _id: true })
      .lean()
      .then(deletedID => res.send(deletedID))
      .catch(next);
  });
