var express = require('express');
var users = express.Router();
var bodyParser = require('body-parser');
var db = require('./../db/users_pg');


users.post('/', db.createUser, function(req, res){
  res.redirect('/');
})

// users.route('/')
users.get('/new', function(req, res) {
  res.render('users/new.html.ejs')
})

users.get('/login', function(req, res) {
  res.render('users/login.html.ejs');
})

users.post('/login', db.loginUser, function(req, res) {
  req.session.user = res.rows

  req.session.save(function() {
    res.redirect('/')
  });
})

users.delete('/logout', function(req, res) {
  req.session.destroy(function(err){
    res.redirect('/');
  })
})





module.exports = users;
