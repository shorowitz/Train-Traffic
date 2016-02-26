'use strict'

require('dotenv').config();

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var logger = require('morgan');
var userRoutes = require(path.join(__dirname, '/routes/users'));

var app = express();
var port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(logger('dev'));

app.set('views', './views');
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
  res.render('./pages/home.html.ejs');
});

//user routes
app.use('/users', userRoutes);

app.listen(port, function(req, res) {
  console.log('Im listening on', port,'//', new Date())
})
