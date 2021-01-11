import React, { Component } from 'react'
import { View, Text } from 'react-native'

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import LoadingView from '../../components/shared/LoadingView'
import Button from '../../components/shared/Button'
import TextField from '../../components/shared/TextField'

import AuthManager from '../../utils/AuthManager'
import Backend from '../../utils/Backend'

import screenStyles from '../../assets/css/screens'
import styles from '../../assets/css/main'

type Props = {}
export default class ProfileDetails extends Component {
  static navigatorStyle = global.Screens.PrimaryNavBar
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      customer: { ...AuthManager.getCurrentUser() }
    }
  }

  componentDidMount() {
    this.props.navigator.setTitle({ title: 'Details' })
  }

  _updateUser(key, value) {
    let { customer } = this.state
    let user = customer.user
    user[key] = value
    customer.user = user
    this.setState({ customer })
  }

  _isFormValid() {
    let isFormValid = true

    if (!this.tfFirstName.isValid()) {
      isFormValid = false
    }
    if (!this.tfLastName.isValid()) {
      isFormValid = false
    }
    if (!this.tfPhone.isValid()) {
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
    let { customer } = this.state
    this.setState({ isLoading: true })

    Backend.updateCustomer(customer)
      .then(customer => {
        AuthManager.currentUser = customer
        this.setState({ isLoading: false })
        this.props.navigator.pop()
      })
      .catch(error => {
        console.warn(error)
        this.setState({ isLoading: false })
        alert(error.message)
      })
  }

  _renderSaveButton() {
    return (
      <View style={{ flex: 1, width: '100%', justifyContent: 'flex-end' }}>
        <Button
          type="primary"
          title="Save"
          style={{
            marginLeft: 50,
            marginRight: 50,
            marginBottom: 50
          }}
          onPress={() => this._onSaveButtonPressed()}
        />
      </View>
    )
  }

  render() {
    let { user } = this.state.customer

    let phone = null
    if (user.phone_country_code) {
      phone = user.phone_country_code + user.phone_number
    }
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={[screenStyles.mainContainer, { padding: 20 }]}
      >
        <Text>First Name</Text>
        <TextField
          ref={tfFirstName => (this.tfFirstName = tfFirstName)}
          value={user.first_name}
          placeholder="First Name"
          containerStyle={{ marginBottom: 20 }}
          onChangeText={firstName => {
            this._updateUser('first_name', firstName)
          }}
        />
        <Text>Last Name</Text>
        <TextField
          ref={tfLastName => (this.tfLastName = tfLastName)}
          value={user.last_name}
          placeholder="Last Name"
          containerStyle={{ marginBottom: 20 }}
          onChangeText={lastName => {
            this._updateUser('last_name', lastName)
          }}
        />
        <Text>Phone</Text>
        <TextField
          ref={tfPhone => (this.tfPhone = tfPhone)}
          value={phone}
          type={'phone'}
          placeholder="Phone"
          containerStyle={{ marginBottom: 20 }}
          onChangePhoneNumber={(phoneCountryCode, phoneNumber) => {
            this._updateUser('phone_country_code', phoneCountryCode)
            this._updateUser('phone_number', phoneNumber)
          }}
        />
        {this._renderSaveButton()}
        <LoadingView isLoading={this.state.isLoading} size="small" />
      </KeyboardAwareScrollView>
    )
  }
}
