import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from 'apollo-boost';
import App from './App';
import { gql } from "apollo-boost";
import './index.css';

const client = new ApolloClient({
  uri: 'http://localhost:8000/graphql',
});

// Test that you can query the api from the client.
client
  .query({
    query: gql`
      {
        events {
          _id
          title
          description
          date
          price
          creator {
            _id
            email
          }
        }
      }
    `
  })
  .then(result => console.log(result));

ReactDOM.render(<App />, document.getElementById('root'));

