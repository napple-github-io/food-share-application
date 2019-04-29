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
  });
