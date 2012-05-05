
/**
 * Module dependencies.
 */

var express = require('express')
  , passport = require('passport')
  , GoogleStrategy = require('passport-google').Strategy
  , routes = require('./routes');

var app = module.exports = express.createServer();

// serialization for passport
// when we have db setup this should change to just userid 
// instead of complete profile
passport.serializeUser(function(user,done) {
  done(null,user);
});
passport.deserializeUser(function(obj,done) {
  done(null, obj);
});

passport.use(new GoogleStrategy({
  returnURL: 'http://milestoned.herokuapp.com/auth/google/return',
  realm: 'http://milestoned.herokuapp.com/'
  //returnURL: 'http://localhost:5000/auth/google/return',
  //realm: 'http://localhost:5000/'
  },
  function(identifier, profile, done) {
    process.nextTick(function () {
      // associate user to record in db
      // return that user profile instead
      profile.identifier = identifier;
      return done(null, profile);
    });
  }
  ));

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.logger());
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({secret: 'lookoutkidtheykeepitallhid'}));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);
app.get('/logout', routes.logout);
app.get('/login', routes.login);
app.get('/nodes/:id', routes.nodes)
app.get('/profile', ensureAuthenticated, routes.profile);

app.get('/auth/google', passport.authenticate('google'));

app.get('/auth/google/return', passport.authenticate('google', {successRedirect: '/',
        failureRedirect: '/login'}));

app.listen(process.env.PORT, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});

// simple method to protect routes
function ensureAuthenticated(req,res,next) {
  if (req.isAuthenticated()) {return next();}
  res.redirect('/login');
}
