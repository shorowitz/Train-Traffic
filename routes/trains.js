var express = require('express');
var trains = express.Router();
var bodyParser = require('body-parser');
var trainsDB = require('../db/trains_pg');
var session = require('express-session');

//DONT NEED THIS NOW BECAUSE MY TRAINS VIEW TAKES CARE OF SAME THING
// trains.use(function(req, res, next) {
//   console.log(req.session)
//   if (req.session.user) {
//     next();
//   } else {
//     res.status(401).json({success: false, data: 'not logged in'})
//   };
// })



trains.get('/', trainsDB.showTrains, function(req, res) {
  res.render('./pages/trains.html.ejs', {user: req.session.user, data: res.rows})
})

trains.get('/:id', trainsDB.showStops, function(req, res) {
  res.render('./pages/stops.html.ejs', {user: req.session.user, data: res.rows})
})

trains.get('/stops/:id/', trainsDB.showAllComments, function(req, res) {
  // var test= {stops: res.stops};
  // console.log(res.stops + 'in trains.get');
  res.render('./pages/comments.html.ejs', {user:req.session.user,  stops: res.stops, data: res.rows})
})

trains.post('/stops/:id', trainsDB.createComment, function(req, res) {
  var stopID = req.params.id;
  res.redirect('./new/' + res.rows[0].id)
  console.log(req.body)
})

trains.get('/stops/new/:cid', trainsDB.showOneComment, function(req, res) {
  console.log(res.rows);
  res.render('./pages/one_comment.html.ejs', {user:req.session.user, data: res.rows})
})

trains.put('/stops/new/:cid', trainsDB.editComment, function(req, res) {
  res.redirect('./' + req.params.cid);
})

trains.delete('/stops/new/:cid', trainsDB.deleteComment, function(req, res) {
  res.redirect('/trains');
})

trains.delete('/logout', function(req, res) {
  req.session.destroy(function(err){
    res.redirect('/');
  })
})




module.exports = trains;
