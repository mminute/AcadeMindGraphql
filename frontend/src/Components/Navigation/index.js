import React from 'react';
import AuthContext from '../../context/auth-context';
import { NavLink } from 'react-router-dom';
import './MainNavigation.css'

const MainNavigation = props => (
  <AuthContext.Consumer>
    {(context) => (
      <header className="main-naviation">
        <div className="main-navigation__logo">
          <h1>EasyEvent</h1>
        </div>
        <nav className="main-navigation__items">
          <ul>
            {!context.token && (
              <li>
                <NavLink to="/auth">
                  Authenticate
                </NavLink>
              </li>
            )}
            <li>
              <NavLink to="/events">
                Events
              </NavLink>
            </li>
            {context.token && (
              <li>
                <NavLink to="/bookings">
                  Bookings
                </NavLink>
              </li>
            )}
          </ul>
        </nav>
      </header>
    )}
  </AuthContext.Consumer>
);

export default MainNavigation;
