var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var db = require('monk')('mongo:27017/ommOfficialDB');
const jwt = require('njwt');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var memesRouter = require('./routes/memes');
var loginRouter = require('./routes/login');
var { signupRouter } = require('./routes/signup')
var screenshotRouter = require('./routes/screenshot')

var app = express();
db.then(() => {
  console.log('Connected correctly to server')
})
app.use(function(req,res,next){
  req.db = db;
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));
app.use(express.json({limit: '100mb'}));
app.use(express.urlencoded({limit: '100mb', extended: false }));
app.use(cookieParser());

// Routes that can be reached unauthenticated
app.use('/login', loginRouter);
app.use('/signup', signupRouter);

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

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/memes', memesRouter);
app.use('/screenshot', screenshotRouter);

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
