var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var db = require('monk')('mongo:27017/ommOfficialDB');
const jwt = require('njwt');

var indexRouter = require('./routes/index');
var singleMemeRouter = require('./routes/meme');
var { templatesRouter } = require('./routes/templates');
var loginRouter = require('./routes/login');
var { signupRouter } = require('./routes/signup')
var screenshotRouter = require('./routes/screenshot')

var app = express();
db.then(() => {
  console.log('Database connected correctly to server')
})

// Add the database to all requests
app.use(function(req,res,next){
  req.db = db;
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));
app.use(express.json({limit: '1000mb'}));
app.use(express.urlencoded({limit: '1000mb', extended: false }));
app.use(cookieParser());

// Routes that can be reached unauthenticated
app.use('/login', loginRouter);
app.use('/signup', signupRouter);
// The route used for the API
app.use('/meme', singleMemeRouter);

// Authentication middleware: Verify jwt token
app.use((req,res,next) => {
  const sentToken = req.headers.authorization
  jwt.verify(sentToken, process.env.SIGNING_KEY, (err, verifiedJwt) => {
    if(err) {
      console.log("Authentication failed!")
      res.status(401).send(err.message)
      return
    } else {
      console.log("JWT Authentication successful!")
      next()
    } 
  })
})

app.use(express.static(path.join(__dirname, 'public')));

// Routes that require authentication
app.use('/templates', templatesRouter);
app.use('/screenshot', screenshotRouter);
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
