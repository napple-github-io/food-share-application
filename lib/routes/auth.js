const User = require('../models/User');
const { ensureAuth } = require('../middleware/ensureAuth');
const { Router } = require('express');

module.exports = Router()
  .post('/signup', (req, res, next) => {
    const {
      username,
      email,
      password, 
      address
    } = req.body;

    User
      .create({ username, email, password, address })
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
  });
