'use strict'

require('dotenv').config();

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var logger = require('morgan');
var pg = require('pg');
var config = "postgres://" + process.env.DB_USER + ":" + process.env.DB_PASS + "@localhost/" + process.env.DB_NAME;
var session = require('express-session');
var pgSession = require('connect-pg-simple')(session);

var usersDB = require('./db/users_pg');
var trainsDB = require('./db/trains_pg')
var stopsDB = require('./db/stops_pg');
var app = express();


var userRoutes = require(path.join(__dirname, '/routes/users'));
var trainRoutes = require(path.join(__dirname, '/routes/trains'))
var stopRoutes = require(path.join(__dirname, '/routes/stops'));

app.use(session({
  store: new pgSession({
    pg : pg,
    conString : config,
    tableName : 'session'
  }),
  secret : 'sososecret',
  resave : false,
  cookie : { maxAge : 30 * 24 * 60 * 60 * 1000 } // 30 days
}))


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(logger('dev'));

app.set('views', './views');
app.set('view engine', 'ejs');

// routes
app.use('/users', userRoutes);
app.use('/trains', trainRoutes);
app.use('/stops',stopRoutes);

app.get('/', function(req, res) {
  res.render('./pages/home.html.ejs', { user : req.session.user});
});

var port = process.env.PORT;

app.listen(port, function(req, res) {
  console.log('Im listening on', port,'//', new Date())
})
