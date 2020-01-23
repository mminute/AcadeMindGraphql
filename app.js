const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');

const graphqlSchema = require('./graphql/schema');
const graphqlResolvers = require('./graphql/resolvers');
const isAuth = require('./middleware/isAuth');

const app = express();

app.use(bodyParser.json());

// Adds request.isAuth to every incoming request going to every resolver
app.use(isAuth);

app.use('/graphql', graphqlHttp({
  schema: graphqlSchema,
  rootValue: graphqlResolvers,
  graphiql: true,
}));

mongoose.connect(
  `mongodb+srv://${process.env.MONGO_USER}:${
    process.env.MONGO_PASSWORD
  }@academindgraphqlapp-zqtqo.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority&authSource=admin`,
  {
    useNewUrlParser: true,
  },
).then(() => {
  app.listen(3000);
}).catch(err => {
  console.log(err);
})
