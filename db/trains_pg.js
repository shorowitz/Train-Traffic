'use strict';

require('dotenv').config();
var pg = require('pg');
var config = "postgres://" + process.env.DB_USER + ":" + process.env.DB_PASS + "@localhost/" + process.env.DB_NAME;
var session = require('express-session');

function showTrains(req, res, next) {
  pg.connect(config, function(err, client, done) {
    if(err){
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    var query = client.query("SELECT * FROM trains ORDER BY id ASC;", function(err, results){
     done();
     if(err) {
      return console.error('error running query', err);
     }
     res.rows = results.rows;
     next();
   });
 })
}

function showStops(req,res,next){
  pg.connect(config, function(err, client, done){
    if(err){
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    var query = client.query(`SELECT stops.name, stops.id
      FROM stops
      INNER JOIN trains
      ON stops.train_id = trains.id
      WHERE trains.id=$1
      GROUP BY stops.name, stops.id
      ORDER BY stops.id ASC;`, [req.params.id],
     function(err, results){
      done();
      if(err) {
       return console.error('error running query', err);
      }
      res.rows = results.rows;
      next();
    });
  });
}


module.exports.showTrains = showTrains;
module.exports.showStops = showStops;