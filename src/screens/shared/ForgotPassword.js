import React, { Component } from 'react'
import { View, Alert } from 'react-native'
import Text from 'react-native-text'

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import screenStyles from '../../assets/css/screens'

import LogoBanner from '../../components/shared/LogoBanner'
import TextField from '../../components/shared/TextField'
import Button from '../../components/shared/Button'

import AuthManager from '../../utils/AuthManager'

type Props = {}
export default class ForgotPassword extends Component<Props> {
  static navigatorStyle = global.Screens.PrimaryNavBar

  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      email: ''
    }
  }

  componentDidMount() {
    this.props.navigator.setTitle({ title: 'Forgot Password' })
  }

  _handleForgotPassword() {
    if (!this._isFormValid()) {
      return
    }

    this._forgotPassword()
  }

  _forgotPassword() {
    this.setState({ isLoading: true })

    let { email } = this.state

    AuthManager.requestResetPassword(email)
      .then(response => {
        this.setState({ isLoading: false })
        this._goToResetPassword()
      })
      .catch(error => {
        Alert.alert('Oops', error.message)
        this.setState({ isLoading: false })
      })
  }

  _isFormValid() {
    let isValid = true

    if (!this.tfEmail.isValid()) {
      isValid = false
    }

    return isValid
  }

  _goToResetPassword() {
    this.props.navigator.push({
      screen: global.Screens.ResetPassword,
      backButtonTitle: '',
      passProps: {
        email: this.state.email
      }
    })
  }

  render() {
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={screenStyles.centerPaddedContainer}
      >
        <Text style={{ textAlign: 'center', marginVertical: 20 }}>
          To request a password reset code, please submit the email address
          linked to your account.
        </Text>
        <TextField
          ref={tfEmail => (this.tfEmail = tfEmail)}
          placeholder="Email"
          type="email"
          value={this.state.email}
          isDisabled={this.state.isLoading}
          onChangeText={email => {
            this.setState({ email })
          }}
        />
        <Button
          title="Send Code"
          style={{ marginTop: 30 }}
          onPress={() => this._handleForgotPassword()}
          isLoading={this.state.isLoading}
        />
      </KeyboardAwareScrollView>
    )
  }
}
