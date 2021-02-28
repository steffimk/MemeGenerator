import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import CustomAppBar from '../CustomAppBar/CustomAppBar'
import { LS_JWT, LS_USERNAME } from '../../constants'

import { LOGIN_ENDPOINT, SIGNUP_ENDPOINT } from '../../communication/requests'

/**
 * Component for logging in and signing up. User can enter a username and a password.
 */
export default class Login extends Component {

  constructor(props){
    super(props);
    this.state = {
        username: '',
        password: '',
        loginErrorMessage: '',
        isLoggedIn: false
    }
  }

  /**
   * Call when user tries to log in or sign up.
   * Sends a POST-request to the backend.
   * @param {Boolean} isLogIn - true when it is a log in, false when it is a sign up
   */
  logIn = (isLogIn) => {
    const endpoint = isLogIn ? LOGIN_ENDPOINT : SIGNUP_ENDPOINT
    const userData = {username: this.state.username, password: this.state.password }
    fetch (endpoint, {
      method: 'POST',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(userData),
    }).then(res => res.json())
      .then( json => {
        if(json.success) {
          const jwt = json.data.token
          localStorage.setItem(LS_JWT, jwt)
          localStorage.setItem(LS_USERNAME, userData.username)
          this.setState({ isLoggedIn: true })
        } else {
          this.setState({ loginErrorMessage: json.data.message })
        }
      }).catch((error) => { console.error('Error:', error) })
  }

  /**
   * Handles user inputs
   * @param {React.ChangeEvent} event 
   */
  handleChange = (event) => {
    this.setState({[event.target.name]: event.target.value})
  }

  render() {
    if (this.state.isLoggedIn) {
      return <Redirect to='/'/>
    }
    return (
      <div>
        <CustomAppBar/>
        <div style={{ paddingTop:'30px', paddingLeft:'30px' }}>
          <TextField name='username' type='text' placeholder='Username' style={{ paddingRight:'20px' }} 
            onChange={this.handleChange}/>
          <TextField name='password' type='password' placeholder='Password' style={{ paddingRight:'20px' }}
            onChange={this.handleChange}/>
          <Button variant='contained' onClick={() => this.logIn(true)} color='primary' style={{ marginRight:'20px' }}>
            Login
          </Button>
          <Button variant='contained' onClick={() => this.logIn(false)}>
            Sign Up
          </Button>
          { (this.state.loginErrorMessage.length > 0) &&
            <TextField name='loginErrorMessage' disabled={true} value={this.state.loginErrorMessage} 
            fullWidth={true} style={{ display:'block', paddingTop:'20px', maxWidth:'50%'}} variant='outlined'/> }
        </div>
      </div>
    )
  }
}