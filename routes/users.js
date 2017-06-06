'use strict';

const express = require('express');
const knex = require('../knex');
const humps = require('humps');
const parse = require('body-parser');
const bcrypt = require('bcrypt');
const bodyParse = parse();
const rounds = 8;

// eslint-disable-next-line new-cap
const router = express.Router();

// YOUR CODE HERE

router.post('/users', function(req, res, next){
  var body = req.body;
  body = humps.decamelizeKeys(body);
  bcrypt.hash(body.password, rounds, function(err, hash) {
    body.hashed_password = body.hashed_password;
    body.hashed_password = hash;
    delete body.password;
    knex.insert(body).into('users')
    .returning('*')
    .then(response => {
      response = humps.camelizeKeys(response);
      delete response[0].hashedPassword;
      res.send(response[0]);
    })
    .catch(err => {
      next(err);
    });
  });
});

module.exports = router;
