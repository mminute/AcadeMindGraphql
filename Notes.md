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

`npm install --save jsonwebtoken` package to generate json web tokens for authentication
    jwt.sign({ ...data to put into the token - ex) email, userId }, 'string used to hash the token and validation - private key', { ...optional token configuration object, expiresIn: '1h' })

To test that authentication middleware has locked down resolvers as expected:
Get token when logging in
use postman to send a POST request to the endpoint
On request -> BODY -> set to 'raw' and format to json
```
{
    "query": "query { login(email: \"test@test.com\", password: \"tester\") { token } }"
}
```

To use authentication token:
In postman headers for request add: `Authorization` key and as the value `Bearer thisIsTheKeyFromAbove`
```
{
    "query": "mutation { createEvent(eventInput: { title: \"Should work\", description: \"this should work\", price: 39.99, date: \"2020-01-23T16:49:43.458Z\" }) { id title } }"
}
```

Starting the frontend!
create-react-app
Create `/frontend` directory, cd into it, `npx create-react-app .`to create a new project with `/frontend` as the top level
In `/frontend` run npm start to run start script int frontend/package.json file
To add routing we are using `npm install --save react-router-dom`

import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
BrowserRouter contains all possible routes
Switch ensures that only one route is rendered at a time?
Route takes a route and a component to render
Redirect does what it says
NavLink renders anchor tag but handles click events so that a real navigation is not triggered

NavLink component adds an `active` class to link for the current route

Set headers to allow CORS