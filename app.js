var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const layouts = require("express-ejs-layouts");

const indexRouter = require('./routes/index');
const pw_auth_router = require('./routes/pwauth')
const notebookRouter = require('./routes/notebook');

var compression = require('compression');
// const csp = require('helmet-csp');
// var helmet = require('helmet');

// Connecting to a Mongo Database Server
const mongodb_URI = 'mongodb://127.0.0.1:27017/pwdemo';
console.log('MONGODB_URI=', mongodb_URI);
const mongoose = require('mongoose');
mongoose.connect(mongodb_URI);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log("we are connected!!!")
});


// Enable sessions and storing session data in the database
const session = require("express-session"); // to handle sessions using cookies 
var MongoDBStore = require('connect-mongodb-session')(session);
const store = new MongoDBStore({
  uri: mongodb_URI,
  collection: 'mySessions'
});

// Catch errors                                                                      
store.on('error', function (error) {
  console.log(error);
});

// middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
  "if they are logged in, continue; otherwise redirect to /login "
  if (res.locals.loggedIn) {
    next();
  } else {
    res.redirect("/login");
  }
}

var app = express();

app.use(session({
  secret: 'This is a secret',
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week                                        
  },
  store: store,
  // Boilerplate options, see:                                                       
  // * https://www.npmjs.com/package/express-session#resave                          
  // * https://www.npmjs.com/package/express-session#saveuninitialized               
  resave: true,
  saveUninitialized: true
}));

// app.use(helmet());          //Protects against well known vulnerabilities
app.use(compression());      //Compress all routes

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use(csp({
//   directives: {
//     defaultSrc: ["'self'"],
//     scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "cdn.jsdelivr.net"],
//     styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
//     fontSrc: ["'self'", "https://cdn.jsdelivr.net"],
//     imgSrc: ["'self'", "cdn.jsdelivr.net"],
//   },
// }));

app.use(pw_auth_router);    //This is the pw_auth_router
app.use(layouts);           //Use the layouts module
app.use('/', indexRouter);  //This is the default route
app.use(notebookRouter);   //This is the notebook route

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
