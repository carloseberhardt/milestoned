neo4j = require("neo4j")

db = new neo4j.GraphDatabase(process.env.NEO4J_URL)

IDX_NAME = "nodes"
IDX_KEY = "type"
IDX_VAL = "user"

User = module.exports = User = (_node) ->
  @_node = _node

proxyProperty = (prop, isData) ->
  Object.defineProperty User::, prop,
    get: ->
      if isData
        @_node.data[prop]
      else
        @_node[prop]

    set: (value) ->
      if isData
        @_node.data[prop] = value
      else
        @_node[prop] = value


proxyProperty "id"
proxyProperty "exists"
proxyProperty "name", true
proxyProperty "email", true

User::save = (callback) ->
  @_node.save (err) ->
    callback err

User::del = (callback) ->
  @_node.del ((err) ->
    callback err
  ), true

User.get = (callback) ->
  db.getNodeById id, (err, node) ->
    return callback(err)  if err
    callback null, new User(node)

User.getByEmail = (callback) ->
    db.getIndexedNode index, property, value, (err, node) ->
        return callback(err) if err
        callback null, new User(node)

User.create = (data, callback) ->
  node = db.createNode(data)
  user = new User(node)
  node.save (err) ->
    return callback(err)  if err
    node.index IDX_NAME, IDX_KEY, IDX_VAL, (err) ->
      return callback(err)  if err
      callback null, user