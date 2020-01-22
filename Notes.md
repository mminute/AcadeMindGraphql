Build a Project with GraphQL, Node, MongoDB, and React.js
https://www.youtube.com/playlist?list=PL55RiY5tL51rG1x02Yyj93iypUuHYXcB_

Create project/ git init
npm init
npm install --save express body-parser
npm install --save-dev nodemon
    Restarts node server when code changes

create app.js

npm install --save express-graphql graphql

http://localhost:3000/graphql

Resolvers return everything then graphQL parser picks data requested

Use MongoDB Atlass free cluster tiers

Configure cluster security for access
Need a user with admin/ReadWrite access
Determine which servers can connect to the cluster
    IP Whitelist
        Add ip address -> add current ip address
        If deploying to web would need to add that ip address instead

MongoDB- academindgraphQ1

Using mongoose to interact with graphql
    3rd party lib installed from npm
    allows to manage data through JS objects
        -> translates objects to queries

`mongoose.connect()` -> GOTO the cluseter -> connect -> connect your application -> short svr connection string
Interpolate in the user/password to the connection string

View `collections` in MongoDB database to see your data
If that isn't available try MongoDB Compass

`npm inatall --save bcryptjs` Password hashing

If: `MongoNetworkError: failed to connect to server [academindgraphqlapp-shard-00-01-zqtqo.mongodb.net:27017] on first connect`
Whitelist your current IP address

Can use mongoDB relations to created/update related object (user owns an event)?

`Event.find().populate('creator')` uses `ref` on models to pull in extra desired data

`Event.find({ _id: { $in: eventIds } })` $in mongoDB operator

`new Schema({}, { timestamps: true })` mongoose automatically adds createdAt and updatedAt timestamps