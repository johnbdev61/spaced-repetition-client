import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Input, Required, Label } from '../Form/Form'
import AuthApiService from '../../services/auth-api-service'
import Button from '../Button/Button'
import './RegistrationForm.css'

class RegistrationForm extends Component {
  static defaultProps = {
    onRegistrationSuccess: () => { }
  }

  state = { error: null }

  firstInput = React.createRef()

  handleSubmit = ev => {
    ev.preventDefault()
    const { name, username, password } = ev.target
    AuthApiService.postUser({
      name: name.value,
      username: username.value,
      password: password.value,
    })
      .then(user => {
        name.value = ''
        username.value = ''
        password.value = ''
        this.props.onRegistrationSuccess()
      })
      .catch(res => {
        this.setState({ error: res.error })
      })
  }

  componentDidMount() {
    this.firstInput.current.focus()
  }

  render() {
    const { error } = this.state
    return (
      <form onSubmit={this.handleSubmit}>
        <div role='alert'>{error && <p>{error}</p>}</div>
        <div className='center-register'>
          <div>
            <Label htmlFor='registration-name-input'>
              Name
              <Required />
            </Label>
            <br />
            <Input
              ref={this.firstInput}
              aria-label='registration-name-input'
              id='registration-name-input'
              name='name'
              required
            />
          </div>
          <div>
            <Label htmlFor='registration-username-input'>
              Username
              <Required />
            </Label>
            <br />
            <Input id='registration-username-input' aria-label='registration-username-input' name='username' required />
          </div>
          <div>
            <Label htmlFor='registration-password-input'>
              Password
              <Required />
            </Label>
            <br />
            <Input
              id='registration-password-input'
              aria-label='registration-password-input'
              name='password'
              type='password'
              required
            />
          </div>
        </div>
        <p className='center-footer'>
          <Button className='btn' type='submit'>Sign up</Button> <br />
          <Link to='/login'>Already have an account?</Link>
        </p>
      </form>
    )
  }
}

export default RegistrationForm
