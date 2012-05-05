
/**
 * Module dependencies.
 */

var express = require('express')
  , passport = require('passport')
  , GoogleStrategy = require('passport-google').Strategy
  , routes = require('./routes');


var app = module.exports = express.createServer();

passport.use(new GoogleStrategy({
  returnURL: 'http://milestoned.herokuapp.com/auth/google/return',
  realm: 'http://milestoned.herokuapp.com/'
 },
 function(identifier, profile, done) {
  User.findOrCreate({openId: identifier }, function(err, user) {
    done(err,user);
  });
}
));

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(passport.initialize());
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

app.get('/auth/google', passport.authenticate('google'));

app.get('/auth/google/return', passport.authenticate('google', {successRedirect: '/',
        failureRedirect: '/login'}));

app.listen(process.env.PORT, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
