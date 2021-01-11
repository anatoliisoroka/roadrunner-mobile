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
export default class ResetPassword extends Component<Props> {
  static navigatorStyle = global.Screens.PrimaryNavBar
  constructor(props) {
    super(props)
    this.state = {
      data: {
        email: props.email
      }
    }
  }

  componentDidMount() {
    this.props.navigator.setTitle({ title: 'Reset Password' })
  }

  _updateData(key, value) {
    let data = { ...this.state.data }
    data[key] = value
    this.setState({ data })
  }

  _isFormValid() {
    let { data } = this.state

    let isValid = true
    let error = null

    if (!this.tfCode.isValid()) {
      isValid = false
    }
    if (!this.tfPassword.isValid()) {
      isValid = false
    }

    if (data.password != data.confirmPassword) {
      error = "Passwords don't match"
      isValid = false
    }

    if (error) {
      Alert.alert('Ooops', error)
    }

    return isValid
  }

  _handleResetPassword() {
    if (!this._isFormValid()) {
      return
    }
    this._resetPassword()
  }

  _resetPassword() {
    let { data } = this.state
    AuthManager.resetPassword(data.email, data.password, data.code)
      .then(response => {
        Alert.alert('Successs', 'Your password has been reset', [
          {
            text: 'Go To Login',
            onPress: () => this._goToLogin()
          }
        ])
      })
      .catch(error => {
        Alert.alert('Ooops', error.message)
      })
  }

  _goToLogin() {
    this.props.navigator.pop()
    this.props.navigator.pop()
  }

  render() {
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={screenStyles.centerPaddedContainer}
      >
        <Text style={{ textAlign: 'center', marginVertical: 20 }}>
          We've sent a verification code to your email, '{this.state.data.email}
          '. Please enter it below to reset your password.
        </Text>
        <TextField
          ref={tfCode => (this.tfCode = tfCode)}
          placeholder="Verification Code"
          onChangeText={code => {
            this._updateData('code', code)
          }}
        />
        <TextField
          ref={tfPassword => (this.tfPassword = tfPassword)}
          placeholder="New Password"
          type="password"
          onChangeText={password => {
            this._updateData('password', password)
          }}
        />
        <TextField
          ref={tfConfirmPassword =>
            (this.tfConfirmPassword = tfConfirmPassword)
          }
          placeholder="Confirm New Password"
          type="password"
          onChangeText={confirmPassword => {
            this._updateData('confirmPassword', confirmPassword)
          }}
        />
        <Button
          title="Reset Password"
          style={{ marginTop: 30 }}
          onPress={() => this._handleResetPassword()}
          isLoading={this.state.isLoading}
        />
      </KeyboardAwareScrollView>
    )
  }
}
