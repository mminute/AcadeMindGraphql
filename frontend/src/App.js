import React, { Component, Fragment } from 'react';
import ApolloClient from 'apollo-client';
import AuthContext from './context/auth-context';
import AuthPage from './Pages/Auth';
import BookingsPage from './Pages/Bookings';
import EventsPage from './Pages/Events';
import MainNavigation from './Components/Navigation';
import { ApolloProvider } from '@apollo/react-hooks';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import './App.css';

class App extends Component {
  state = {
    token: null,
    userId: null,
  }

  login = (token, userId, tokenExpiration) => {
    this.setState({ token, userId })
  };

  logout = () => {
    this.setState({ token: null, userId: null });
  };

  render() {
    const { token, userId } = this.state;

    const httpLink = createHttpLink({
      uri: 'http://localhost:8000/graphql',
    });

    const authLink = setContext((_, { headers }) => {
      // return the headers to the context so httpLink can read them
      return {
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : "",
        }
      }
    });

    const client = new ApolloClient({
      link: authLink.concat(httpLink),
      cache: new InMemoryCache(),
    });


    return (
      <ApolloProvider client={client}>
        <BrowserRouter>
          <Fragment>
            <AuthContext.Provider
              value={{
                token,
                userId,
                login: this.login,
                logout: this.logout,
              }}
            >
              <MainNavigation />
              <main className="main-content">
                <Switch>
                  {this.state.token && <Redirect from="/" to="/events" exact />}
                  {this.state.token && <Redirect from="/auth" to="/events" exact />}

                  {!this.state.token && <Route path="/auth" component={AuthPage} />}
                  {this.state.token && <Route path="/bookings" component={BookingsPage} />}
                  <Route path="/events" component={EventsPage} />

                  {!this.state.token && <Redirect to="/auth" exact />}
                </Switch>
              </main>
            </AuthContext.Provider>
          </Fragment>
        </BrowserRouter>
      </ApolloProvider>
    );
  }
}

export default App;

