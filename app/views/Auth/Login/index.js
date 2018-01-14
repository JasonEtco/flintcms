import React, { Component } from 'react'
import { object } from 'prop-types'
import { post } from 'axios'
import { getUrlParameter } from 'utils/helpers'
import Button from 'components/Button'
import Input from 'components/Input'
import Notification from 'components/Notification'
import LoginContainer from 'containers/LoginContainer'

export default class Login extends Component {
  static propTypes = {
    history: object.isRequired
  }

  constructor (props) {
    super(props)
    this.checkInputs = this.checkInputs.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  state = { disableButton: true }

  checkInputs () {
    const { email, password } = this
    this.setState({ disableButton: !email.value || !password.value })
  }

  handleSubmit (e) {
    e.preventDefault()
    post('/admin/login', {
      email: this.email.value,
      password: this.password.value
    })
      .then(() => {
        const path = getUrlParameter('p')
        if (path) {
          this.props.history.push(path.split('/admin')[1])
        } else {
          this.props.history.push('/')
        }
      })
      .catch(() => {
        this.setState({ error: true })
      })
  }

  render () {
    const { error } = this.state

    return (
      <LoginContainer>
        <form className='login__inner' onSubmit={this.handleSubmit}>
          {error && <Notification type='error'>Oh shucks! Either the account you&apos;re trying to log into does not exist, or the email/password is wrong. Try again!</Notification>}
          <Input required onChange={this.checkInputs} ref={(r) => { this.email = r }} name='email' autoFocus big placeholder='Email' type='email' />
          <Input required onChange={this.checkInputs} ref={(r) => { this.password = r }} name='password' big placeholder='Password' type='password' />
          <Button type='submit' disabled={this.state.disableButton}>Log In</Button>
        </form>
      </LoginContainer>
    )
  }
}
