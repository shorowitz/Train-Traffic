var express = require('express');
var users = express.Router();
var bodyParser = require('body-parser');
var usersDB = require('../db/users_pg');


users.post('/', usersDB.createUser, function(req, res){
  res.redirect('/');
})

// users.route('/')
users.get('/new', function(req, res) {
  res.render('pages/new.html.ejs')
})

users.get('/login', function(req, res) {
  res.render('pages/login.html.ejs');
})

users.post('/login', usersDB.loginUser, function(req, res) {
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
