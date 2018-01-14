import React, { Component } from 'react'
import { post } from 'axios'
import Button from 'components/Button'
import Input from 'components/Input'
import Notification from 'components/Notification'
import LoginContainer from 'containers/LoginContainer'

export default class ForgotPassword extends Component {
  constructor (props) {
    super(props)
    this.checkInputs = this.checkInputs.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  state = { disabledButton: true, success: false, error: false }

  checkInputs () {
    this.setState({ disableButton: !this.email.value })
  }

  handleSubmit (e) {
    e.preventDefault()
    post('/admin/forgotpassword', {
      email: this.email.value
    })
      .then(() => {
        this.setState({ success: true })
      })
      .catch(() => {
        this.setState({ error: true })
      })
  }

  render () {
    const { success, error } = this.state

    return (
      <LoginContainer>
        {success
          ? <div className='login__inner'>The email has been sent; check your inbox!</div>
          : <form className='login__inner' onSubmit={this.handleSubmit}>
            {error && <Notification type='error'>There was an error, please try again later.</Notification>}
            <legend className='login__title'>Forgot your password?</legend>
            <Input required onChange={this.checkInputs} ref={(r) => { this.email = r }} name='email' autoFocus big placeholder='Email' type='email' />
            <Button type='submit' disabled={this.state.disableButton}>Reset Password</Button>
          </form>
        }
      </LoginContainer>
    )
  }
}
