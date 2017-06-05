'use strict';

const express = require('express');
const knex = require('../knex');
const humps = require('humps');
const parse = require('body-parser');
const bodyParse = parse();

// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/books', function(req, res, next) {
  knex.select().from('books').orderBy('title')
  .then(function(data){
    data = humps.camelizeKeys(data);
    res.send(data);
  });
});

router.get('/books/:id', function(req, res, next) {
  knex.select().from('books').where('books.id', '=', req.params.id)
  .then(function(data){
    data = humps.camelizeKeys(data);
    res.send(data[0]);
  });
});

router.post('/books', function(req, res, next) {
  var body = req.body;
  body = humps.decamelizeKeys(body);
  knex.insert(body).into('books')
  .returning('*')
  .then(response => {
    delete response.created_at;
    delete response.updated_at;
    response = humps.camelizeKeys(response);
    res.send(response[0]);
  })
  .catch(err => {
    next(err);
  });
});

router.patch('/books/:id', function(req, res, next) {
  var body = humps.decamelizeKeys(req.body);
  var id = req.params.id;
  knex('books').where('id', id).update(body)
  .returning('*')
  .then(response => {
    delete response.created_at;
    delete response.updated_at;
    response = humps.camelizeKeys(response);
    res.send(response[0]);
  })
  .catch(err => {
    next(err);
  });
});

router.delete('/books/:id', function(req, res, next) {
  var body = humps.decamelizeKeys(req.body);
  var id = req.params.id;
  knex('books').where('id', id).del()
  .returning('*')
  .then(response => {
    delete response[0].id;

    response = humps.camelizeKeys(response);
    res.send(response[0]);
  })
  .catch(err => {
    next(err);
  });
});

module.exports = router;
