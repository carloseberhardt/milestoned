/*
 * GET index
 */

exports.index = function(req, res){
    if (req.user) {
        res.send('Hello ' + req.user.displayName + '. You can <a href="/logout">logout.</a>');
    } else {
        res.send('This is the index. You can <a href="/auth/google">Sign in with Google</a>.')    
    }
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
