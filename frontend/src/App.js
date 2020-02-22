import React, { Component, Fragment } from 'react';
import AuthContext from './context/auth-context';
import AuthPage from './Pages/Auth';
import BookingsPage from './Pages/Bookings';
import EventsPage from './Pages/Events';
import MainNavigation from './Components/Navigation';
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

    return (
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
                {!this.state.token && <Redirect from="/" to="/auth" exact />}
                {this.state.token && <Redirect from="/" to="/events" exact />}
                {this.state.token && <Redirect from="/auth" to="/events" exact />}
                {!this.state.token && <Route path="/auth" component={AuthPage} />}
                {this.state.token && <Route path="/bookings" component={BookingsPage} />}
                <Route path="/events" component={EventsPage} />
              </Switch>
            </main>
          </AuthContext.Provider>
        </Fragment>
      </BrowserRouter>

    );
  }
}

export default App;

