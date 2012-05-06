/*
 * GET index
 */

exports.index = function(req, res){
    res.render('index', {user: req.user,
                        title: 'Milestoned'});
}

exports.login = function(req,res) {
    res.send('<a href="/auth/google">Sign In with Google</a>');
}

exports.logout = function(req, res){
    console.log("entering logout.")
    req.logOut();
    res.redirect('/');
};

var request = require("superagent");
exports.nodes = function(req,res){
  request.post(process.env.NEO4J_REST_URL + '/cypher').send({
    query: 'START n=node(1) RETURN n.name'
  }).end(function(neo4jRes){
    res.send(neo4jRes.text);
  });
};
