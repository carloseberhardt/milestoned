request = require("superagent")
exports.index = (req, res) ->
  request.post(process.env.NEO4J_REST_URL + "/cypher").send(query: "START n=node(1) RETURN n.name").end (neo4jRes) ->
    res.send neo4jRes.text