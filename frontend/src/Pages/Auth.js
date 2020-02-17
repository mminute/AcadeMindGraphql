import React, { Component } from 'react';
import './Auth.css';

class AuthPage extends Component {
  state = {
    formAction: 'login',
  }

  constructor(props) {
    super(props);
    this.emailElement = React.createRef();
    this.passwordElement = React.createRef();
  }

  handleSwitchMode = () => {
    const formAction = this.state.formAction === 'login' ? 'signup' : 'login';

    this.setState({ formAction });
  }

  handleSignup(email, password) {
    const requestBody = {
      query: `
        mutation {
          createUser(userInput: {email: "${email}", password: "${password}"}) {
            _id
            email
          }
        }
      `,
    };

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(res => {
      if (![200, 201].includes(res.status)) {
        throw new Error('Failed!')
      }

      return res.json();
    })
    .then(resData => {
      console.log(resData);
    }).catch(err => {
      console.log(err);
    });
  }

  handleLogin(email, password) {
    const requestBody = {
      query: `
        query {
          login(email: "${email}", password: "${password}") {
            userId
            token
            tokenExpiration
          }
        }
      `,
    };

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(res => {
      if (![200, 201].includes(res.status)) {
        throw new Error('Failed!')
      }

      return res.json();
    })
    .then(resData => {
      console.log(resData);
    }).catch(err => {
      console.log(err);
    });
    // login(email: String!, password: String!): AuthData!
  }

  handleSubmit = (evt) => {
    evt.preventDefault();
    const email = this.emailElement.current.value;
    const password = this.passwordElement.current.value;

    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    if (this.state.formAction === 'login') {
      this.handleSignup(email, password);
    } else {
      this.handleLogin(email, password);
    }
  }

  render() {
    return (
      <form className="auth-form" onSubmit={this.handleSubmit}>
        <div className="form-control">
          <label htmlFor="email">E-Mail</label>
          <input type="email" id="email" ref={this.emailElement}/>
        </div>
        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" ref={this.passwordElement}/>
        </div>
        <div className="form-actions">
          <button type="submit">
            Submit
          </button>
          <button type="button" onClick={this.handleSwitchMode}>
            Switch to {this.state.formAction === 'signup' ? 'Signup' : 'Login'}
          </button>
        </div>
      </form>
    );
  }  
}

export default AuthPage;
