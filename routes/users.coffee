User = require("../models/user")
exports.create = (req, res, next) ->
  User.create
    name: req.body["name"]
    email: req.body["email"]
  , (err, user) ->
    return next(err)  if err
    res.redirect "/"