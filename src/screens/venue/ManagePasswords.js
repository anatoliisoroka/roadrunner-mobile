import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import LoadingView from '../../components/shared/LoadingView'
import Button from '../../components/shared/Button'
import TextField from '../../components/shared/TextField'

import AuthManager from '../../utils/AuthManager'
import Backend from '../../utils/Backend'

import screenStyles from '../../assets/css/screens'

type Props = {}
export default class ManagePasswords extends Component {
  static navigatorStyle = global.Screens.PrimaryNavBar
  constructor(props) {
    super(props)
    this.state = {
      companyMember: { ...AuthManager.getCurrentUser() },
      isLoading: false,
      currentPassword: null,
      newPassword: null,
      confirmPassword: null,
      validationMessage: null
    }
  }

  componentDidMount() {
    this.props.navigator.setTitle({ title: 'Manage Passwords' })
  }

  _isFormValid() {
    let isFormValid = true
    if (!this.refs.tfCurrentPassword.isValid()) {
      isFormValid = false
    }
    if (!this.refs.tfNewPassword.isValid()) {
      isFormValid = false
    }
    if (!this.refs.tfConfirmPassword.isValid()) {
      isFormValid = false
    }
    if (this.state.newPassword !== this.state.confirmPassword) {
      this.setState({
        validationMessage: 'Passwords entered do not match.'
      })
      isFormValid = false
    }

    return isFormValid
  }

  _onSaveButtonPressed() {
    if (!this._isFormValid()) {
      return
    }
    this._save()
  }

  _save() {
    let {
      companyMember,
      currentPassword,
      newPassword,
      confirmPassword
    } = this.state
    this.setState({ isLoading: true })
    console.log('company_member', companyMember)
    companyMember.user.current_password = currentPassword
    companyMember.user.password = newPassword

    Backend.updateCompanyMember(companyMember)
      .then(response => {
        this.setState({ isLoading: false })
        this.props.navigator.pop()
      })
      .catch(error => {
        console.warn(error.message)
        alert(error.message)
        this.setState({ isLoading: false })
      })
  }

  _renderBottomContainer() {
    return (
      <View style={styles.bottomContainer}>
        <View>{this._renderValidationMessage()}</View>
        <Button
          type="primary"
          title="Save"
          style={styles.button}
          onPress={() => this._onSaveButtonPressed()}
        />
      </View>
    )
  }

  _renderValidationMessage() {
    if (this.state.validationMessage == null) {
      return null
    }
    return (
      <Text style={styles.validationMessage}>
        {this.state.validationMessage}
      </Text>
    )
  }

  render() {
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={[screenStyles.mainContainer, { padding: 20 }]}
      >
        <TextField
          ref="tfCurrentPassword"
          value={this.state.currentPassword}
          type="password"
          placeholder="Current Password"
          containerStyle={{ marginBottom: 10 }}
          onChangeText={currentPassword => {
            this.setState({ currentPassword })
          }}
        />

        <TextField
          ref="tfNewPassword"
          value={this.state.newPassword}
          type="password"
          placeholder="New Password"
          containerStyle={{ marginBottom: 10 }}
          onChangeText={newPassword => {
            this.setState({ newPassword })
          }}
        />

        <TextField
          ref="tfConfirmPassword"
          value={this.state.confirmPassword}
          type="password"
          placeholder="Confirm Password"
          containerStyle={{ marginBottom: 10 }}
          onChangeText={confirmPassword => {
            this.setState({ confirmPassword })
          }}
        />

        {this._renderBottomContainer()}
        <LoadingView isLoading={this.state.isLoading} size="small" />
      </KeyboardAwareScrollView>
    )
  }
}

const styles = StyleSheet.create({
  button: {
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 50
  },
  bottomContainer: { flex: 1, width: '100%', justifyContent: 'flex-end' },
  validationMessage: {
    color: 'red',
    paddingBottom: 20,
    textAlign: 'center',
    fontSize: 15
  }
})
