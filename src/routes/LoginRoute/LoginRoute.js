import React, { Component } from 'react'
import LoginForm from '../../components/LoginForm/LoginForm'
import './LoginRoute.css'

class LoginRoute extends Component {
  static defaultProps = {
    location: {},
    history: {
      push: () => { },
    },
  }

  handleLoginSuccess = () => {
    const { location, history } = this.props
    const destination = (location.state || {}).from || '/'
    history.push(destination)
  }

  render() {
    return (
      <div className='words-card center-content'>
        <h2 className='login'>Login</h2>
        <LoginForm
          onLoginSuccess={this.handleLoginSuccess}
        />
      </div>
    );
  }
}

export default LoginRoute
