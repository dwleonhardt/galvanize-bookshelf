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

router.get('/favorites', function(req, res, next){
  var body = req.body;
  var token = req.cookies.token;
  if (token) {
    jwt.verify(token, 'dogface', function(err, decoded){
      if (err) {
        res.setHeader('content-type', 'text/plain');
        res.status(401).send('Unauthorized');
      }
      else{
        knex.from('favorites')
        .innerJoin('books', 'book_id', 'books.id')
        .then(function(data){
          data = humps.camelizeKeys(data);
          res.send(data);
        });
      }
    });
  }
});

router.get('/favorites/check', function(req, res, next){
  var bookId = req.query.bookId;
  var body = req.body;
  var token = req.cookies.token;
  if (token) {
    jwt.verify(token, 'dogface', function(err, decoded){
      if (err) {
        res.setHeader('content-type', 'text/plain');
        res.status(401).send('Unauthorized');
      }
      else{
        knex.select('book_id').from('favorites')
        .where('book_id', bookId)
        .then(function(data){
          if (data.length === 1) {
            res.send(true);
          }
          else {
            res.send(false);
          }
        });
      }
    });
  }
});

router.post('/favorites', function(req, res, next){
  var book = req.body.bookId;

  var token = req.cookies.token;

  if (token) {
    jwt.verify(token, 'dogface', function(err, decoded){
      if (err) {
        res.setHeader('content-type', 'text/plain');
        res.status(401).send('Unauthorized');
      }
      else {
        knex.select('*').from('books')
        .where('books.id', book)
        .then(function(data){
          if (data[0]) {
            knex('favorites').insert({book_id: book, user_id: decoded.id})
            .returning('*')
            .then(response => {
              res.send(humps.camelizeKeys(response[0]));
            });
          }
          else{
            res.status(404).send('Not found');
          }
        });
      }
    });
  }
});

router.delete('/favorites', function(req, res, next){
  var book = req.body.bookId;
  var token = req.cookies.token;

  if (token) {
    jwt.verify(token, 'dogface', function(err, decoded){
      if (err) {
        res.setHeader('content-type', 'text/plain');
        res.status(401).send('Unauthorized');
      }
      else {
        knex.select('*').from('books')
        .where('books.id', book)
        .then(function(data){
          if (data[0]) {
            knex('favorites').where('book_id', book).del()
            .returning('*')
            .then(response => {
              response = humps.camelizeKeys(response[0]);
              delete response.id;
              res.send(response);
            });
          }
          else{
            res.status(404).send('Not found');
          }
        });
      }
    });
  }
});

module.exports = router;
