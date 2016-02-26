var express = require('express');
var stops = express.Router();
var bodyParser = require('body-parser');
var stopsDB = require('../db/stops_pg');
var session = require('express-session');

stops.use(function(req, res, next) {
  console.log(req.session)
  if (req.session.user) {
    next();
  } else {
    res.status(401).json({succes: false, data: 'not logged in'})
  };
})

// stops.route('/')
// .get( db.showAllStops, function(req,res) {
//   res.render('./pages/burgers-all.html.ejs', {data: res.rows});
// })
// .post(db.createBurger, function(req,res) {
//   res.redirect('./' + res.rows[0].order_id);
//   // console.log(req.body);
// });

module.exports = stops;
