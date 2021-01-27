import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import TokenService from '../../services/token-service'
import UserContext from '../../contexts/UserContext'
import './Header.css'

class Header extends Component {
  static contextType = UserContext

  handleLogoutClick = () => {
    this.context.handleLogout()
  }

  renderLogoutLink() {
    return (
      <div>
        <div className='name'>
          <span><b>Logged in as </b>{this.context.user.name}</span>
        </div>
        <nav>
          <Link className='user' onClick={this.handleLogoutClick} to='/login'>
            Logout
          </Link>
        </nav>
      </div>
    )
  }

  renderLoginLink() {
    return (
      <nav>
        <Link className='user' to='/login'>
          Login
        </Link>
        {' '}
        <Link className='user' to='/register'>
          Sign up
        </Link>
      </nav>
    )
  }

  render() {
    return (
      <header>
        <h1 className='header'>
          <Link className='title' to='/'>
            Spaced repetition
          </Link>
        </h1>
        {TokenService.hasAuthToken()
          ? this.renderLogoutLink()
          : this.renderLoginLink()}
      </header>
    )
  }
}

export default Header
