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

function showAllComments(req,res,next){
  pg.connect(config, function(err, client, done){
    if(err){
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    console.log('whats goin on');
    console.log(req.params.id)
    var query = client.query(`SELECT stops.id, stops.name, users.username, comments.note, comments.posted
      FROM comments
      INNER JOIN stops
      ON comments.stop_id = stops.id
      LEFT JOIN users
      ON comments.user_id = users.id
      WHERE stops.id = $1
      GROUP BY stops.id, stops.name, users.username, comments.posted, comments.note
      ORDER BY comments.posted DESC;`, [req.params.id],
     function(err, results){
       console.log(results.rows, 'this is first query')
      done();
      if(err) {
       return console.error('error running query', err);
      }
      res.rows = results.rows;
      // console.log(res.rows);

      if (res.rows.length === 0) {
        console.log('im null');
        var query2 = client.query(`SELECT id, name
        FROM stops
        WHERE id = $1`, [req.params.id],
        function(err, results){
          console.log(results.rows, 'this is second query')
         done();
         if(err) {
          return console.error('error running query', err);
         }
         res.stops = results.rows;
        //  console.log(res.stops[0].name);
         next();
      })
    } else {
      next();
    };

  });
})
}


function createComment (req,res,next) {
  pg.connect(config, function(err, client, done){
    if(err){
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // console.log('before query');
    // console.log(req.session.user)
    var note = req.body.note;
    var stop_id = req.params.id;
    var user_id = req.session.user.id;
    // console.log(req.session.user)
    var query = client.query(`INSERT INTO comments (note, stop_id, user_id)
    VALUES ($1, $2, $3)
    RETURNING id;`, [note, stop_id, user_id],
    function(err, results){
     done();
     if(err) {
      return console.error('error running query', err);
     }
     res.rows = results.rows;
    //  console.log(res.rows)
     next();
    });
  });
}

function showOneComment (req, res,next) {
  pg.connect(config, function(err, client, done){
    if(err){
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    var query = client.query(`SELECT s.id as stop_id, s.name, users.username, comments.id, comments.note, comments.posted
      FROM comments
      INNER JOIN stops s
      ON comments.stop_id = s.id
      LEFT JOIN users
      ON comments.user_id = users.id
      WHERE comments.id = $1
      GROUP BY s.id, s.name, users.username, comments.id, comments.posted, comments.note;`, [req.params.cid],
      function(err, results){
       done();
       if(err) {
        return console.error('error running query', err);
       }
       res.rows = results.rows;
       console.log(res.rows)
       next();
      });
    });
  }

  function editComment (req, res,next) {
    pg.connect(config, function(err, client, done){
      if(err){
        done();
        console.log(err);
        return res.status(500).json({success: false, data: err});
      }
      var query = client.query('UPDATE comments SET note=$1 WHERE id=$2;', [req.body.note, req.params.id],
      function(err, results){
         done();
         if(err) {
          return console.error('error running query', err);
         }
         next();
       });
     })
   };



module.exports.showTrains = showTrains;
module.exports.showStops = showStops;
module.exports.showAllComments = showAllComments;
module.exports.createComment = createComment;
module.exports.showOneComment = showOneComment;
module.exports.editComment = editComment;
