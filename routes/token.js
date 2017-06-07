'use strict';

const express = require('express');
const knex = require('../knex');
const bodyParse = require('body-parser');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const humps = require('humps');
const bcrypt = require('bcrypt');
const env = require('dotenv')
const rounds = 8;
// eslint-disable-next-line new-cap
const router = express.Router();

var jwt_key = process.env.JWT_KEY;

router.use(cookieParser());

router.get('/token', function(req, res, next){
  var body = req.body;
  var token = req.cookies.token;
  if (token) {
    jwt.verify(token, 'dogface', function(err, decoded){
      if (err) {
      }
      else{
        res.send(true);
      }
    });
  }
  else {
    res.send(false);
  }
});

router.post('/token', function(req, res, next){
  var email = req.body.email;
  var password = req.body.password;

  knex.select('email')
  .from('users')
  .then(function(data){
    if (data[0].email !== email) {
      res.setHeader('content-type', 'text/plain');
      res.status(400).send('Bad email or password');
    }
    else {
      knex.select('*')
      .from('users')
      .where('email',email)
      .then(function(data2){
        bcrypt.compare(password, data2[0].hashed_password, function(err, response) {
          if(err || response === false){
            res.setHeader('content-type', 'text/plain');
            res.status(400).send('Bad email or password');
          }
          else{
            var currentUser = data2[0].id;
            var token = jwt.sign({id: currentUser }, jwt_key);
            res.cookie('token', token, {httpOnly: true});
            delete data2[0].hashed_password;
            delete data2[0].created_at;
            delete data2[0].updated_at;
            res.send(humps.camelizeKeys(data2[0]));
          }
        });
      });
    }
  });
});

router.delete('/token', function(req, res, next){
  res.cookie('token', '', {httpOnly: true});
  res.send(true);
});


module.exports = router;
