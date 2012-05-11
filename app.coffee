
# dependencies
express = require("express")
passport = require("passport")
GoogleStrategy = require("passport-google").Strategy
routes = require("./routes")
User = require("./models/user")

app = module.exports = express.createServer()

# serialize and deserialize user for session. When db hooked up just do id instead of full user
passport.serializeUser (user, done) ->
  done null, user

passport.deserializeUser (obj, done) ->
  done null, obj

# func to protect routes
ensureAuthenticated = (req, res, next) ->
  return next()  if req.isAuthenticated()
  res.redirect "/login"

# google login
passport.use new GoogleStrategy(
  returnURL: "http://milestoned.herokuapp.com/auth/google/return"
  realm: "http://milestoned.herokuapp.com/"
, (identifier, profile, done) ->
  process.nextTick ->
    profile.identifier = identifier
    User.getByEmail profile.emails[0].value, (err, user) ->
      if err
        User.create 
          name: profile.displayName
          email: profile.emails[0].value,
          (err, user) ->
            console.log err if err
    done null, profile
)

#configure express server
app.configure ->
  app.set "views", __dirname + "/views"
  app.set "view engine", "jade"
  app.use express.logger()
  app.use express.cookieParser()
  app.use express.bodyParser()
  app.use express.methodOverride()
  app.use express.session(secret: "lookoutkidtheykeepitallhid")
  app.use passport.initialize()
  app.use passport.session()
  app.use app.router
  app.use express.static(__dirname + "/public")

app.configure "development", ->
  app.use express.errorHandler(
    dumpExceptions: true
    showStack: true
  )

app.configure "production", ->
  app.use express.errorHandler()

#routing
app.get "/", routes.site.index
app.get "/logout", routes.site.logout
app.get "/login", routes.site.login
app.get "/nodes/:id", routes.site.nodes
app.get "/users/:id", ensureAuthenticated, routes.users.show
app.get "/users", routes.users.signup
app.post "/users", routes.users.create
app.get "/auth/google", passport.authenticate("google")
app.get "/auth/google/return", passport.authenticate("google",
  successRedirect: "/"
  failureRedirect: "/login"
)

#run
app.listen process.env.PORT, ->
  console.log "Express server listening on port %d in %s mode", app.address().port, app.settings.env