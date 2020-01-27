import React, { Fragment } from 'react';
import AuthPage from './Pages/Auth';
import BookingsPage from './Pages/Bookings';
import EventsPage from './Pages/Events';
import MainNavigation from './Components/Navigation';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Fragment>
        <MainNavigation />
        <main className="main-content">
          <Switch>
            <Redirect from="/" to="/auth" exact />
            <Route path="/auth" component={AuthPage} />
            <Route path="/bookings" component={BookingsPage} />
            <Route path="/events" component={EventsPage} />
          </Switch>
        </main>
      </Fragment>
    </BrowserRouter>

  );
}

export default App;

/*
      <div className="App">
        <h1>It works!</h1>
      </div>
*/
