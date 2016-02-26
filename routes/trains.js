var express = require('express');
var trains = express.Router();
var bodyParser = require('body-parser');
var trainsDB = require('../db/trains_pg');
var session = require('express-session');

trains.use(function(req, res, next) {
  console.log(req.session)
  if (req.session.user) {
    next();
  } else {
    res.status(401).json({succes: false, data: 'not logged in'})
  };
})

trains.get('/', trainsDB.showTrains, function(req, res) {
  res.render('./pages/trains.html.ejs', {user: req.session.user, data: res.rows})
})

trains.get('/:id', trainsDB.showStops, function(req,res) {
  res.render('./pages/stops.html.ejs', {user: req.session.user, data: res.rows})
})

// trains.get('/stops/:id', function(req,res) {
//   res.render('./pages/showAllComments', {user:req.session.user})
// })





module.exports = trains;
