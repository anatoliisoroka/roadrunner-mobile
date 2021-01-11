import React, { Component } from 'react'
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  Image,
  View,
  ScrollView,
  Alert
} from 'react-native'

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Icon } from 'react-native-elements'

import screenStyles from '../../assets/css/screens'

import LoadingView from '../../components/shared/LoadingView'
import LogoBanner from '../../components/shared/LogoBanner'
import Hr from '../../components/shared/Hr'
import TextField from '../../components/shared/TextField'
import Button from '../../components/shared/Button'

import AuthManager from '../../utils/AuthManager'
import Backend from '../../utils/Backend'

type Props = {}
export default class CreateAccount extends Component<Props> {
  static navigatorStyle = global.Screens.PrimaryNavBar

  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      firstName: null,
      lastName: null,
      countryCode: null,
      phoneNumber: null,
      email: null,
      password: null,
      showValidationText: false,
      agreed: false
    }
  }

  _isFormValid() {
    let isValid = true
    if (!this.refs.tfFirstName.isValid()) {
      isValid = false
    }
    if (!this.refs.tfLastName.isValid()) {
      isValid = false
    }
    if (!this.refs.tfEmail.isValid()) {
      isValid = false
    }
    if (!this.refs.tfPassword.isValid()) {
      isValid = false
    }
    if (!this.state.agreed) {
      isValid = false
      this.setState({ showValidationText: true })
    }
    return isValid
  }

  _onNextButtonPressed() {
    if (!this._isFormValid()) {
      return
    }
    this._save()
  }

  _verifyPhoneNumber(){
      this._goTo(global.Screens.PhoneVerification, {
        onPhoneVerified: () => {
          this._goTo(global.Screens.CreatePayment)
      }})
  }

  _saveAddress(location){
    Backend.saveAddress(location)
      .then(response => {
        this._verifyPhoneNumber()
      })
      .catch(error => {
        console.warn(error.message)
        this._verifyPhoneNumber()
      })
  }

  _save() {
    this.setState({ isLoading: true })
    let location = AuthManager.getCurrentUserLocation()
    let data = {
      user: {
        first_name: this.state.firstName,
        last_name: this.state.lastName,
        email: this.state.email,
        password: this.state.password,
      }
    }
    AuthManager.registerCustomer(data)
      .then(user => {
        this.setState({ isLoading: false })
        if(location){
          this._saveAddress(location)
        }else{
          this._verifyPhoneNumber()
        }
      })
      .catch(error => {
        this.setState({ isLoading: false })
        alert(error.message)
      })
  }

  _goTo(screen, passProps = {}) {
    this.props.navigator.push({
      screen,
      passProps
    })
  }

  _iconPressed() {
    this.setState({ agreed: !this.state.agreed })
  }

  _getIconBackgroundColor() {
    return this.state.agreed === true ? global.Colors.Primary : 'white'
  }

  _renderAgreeValidationText() {
    if (!this.state.showValidationText) {
      return
    }
    return (
      <Text style={styles.validationText}>
        You must agree to the 'Terms & Conditions' to proceed.
      </Text>
    )
  }

  _renderTermsView() {
    return (
      <View style={{ backgroundColor: 'white' }}>
        <View style={[styles.row, { marginTop: 20 }]}>
          <View>
            <Icon
              name="check"
              size={20}
              containerStyle={[
                styles.iconContainer,
                { backgroundColor: this._getIconBackgroundColor() }
              ]}
              color="white"
              onPress={() => this._iconPressed()}
            />
          </View>
          <View style={styles.row}>
            <Text style={styles.iconText}>I agree to the </Text>
            <TouchableOpacity
              onPress={() =>
                this._goTo(global.Screens.Web, {
                  url: global.Api.Terms,
                  title: 'Terms & Conditions'
                })
              }
            >
              <Text style={{ color: global.Colors.Primary, fontWeight: '600' }}>
                Terms & Conditions
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {this._renderAgreeValidationText()}
      </View>
    )
  }

  render() {
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={[
          screenStyles.mainPaddedContainer,
          { paddingBottom: 200, backgroundColor: 'white' }
        ]}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Create Account</Text>
        </View>

        <TextField
          ref="tfFirstName"
          placeholder="First Name"
          onChangeText={firstName => this.setState({ firstName })}
          containerStyle={[
            styles.inputContainer,
            { borderTopLeftRadius: 5, borderTopRightRadius: 5 }
          ]}
          textStyle={styles.inputText}
        />
        <TextField
          ref="tfLastName"
          placeholder="Last Name"
          type="text"
          onChangeText={lastName => this.setState({ lastName })}
          containerStyle={styles.inputContainer}
          textStyle={styles.inputText}
        />
        <TextField
          ref="tfEmail"
          placeholder="Email"
          type="email"
          onChangeText={email => this.setState({ email })}
          containerStyle={styles.inputContainer}
          textStyle={styles.inputText}
        />
        <TextField
          ref="tfPassword"
          placeholder="Password"
          type="password"
          onChangeText={password => this.setState({ password })}
          containerStyle={[
            styles.inputContainer,
            { borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }
          ]}
          textStyle={styles.inputText}
        />
        <Text style={styles.text}>
          Your password must be longer than 8 characters and hard to guess.
        </Text>

        {this._renderTermsView()}
        <Button
          title="Next"
          isLoading={this.state.isLoading}
          style={styles.button}
          onPress={() => this._onNextButtonPressed()}
        />
        <LoadingView isLoading={this.state.isLoading} size="small" />
      </KeyboardAwareScrollView>
    )
  }
}

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: '#F7F7F7',
    borderBottomColor: 'white',
    height: 50,
    justifyContent: 'center',
    marginTop: 0
  },
  inputText: { marginLeft: 10 },
  logo: { marginTop: 80, marginBottom: 20, height: 200, width: 200 },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '35%'
  },
  title: {
    fontSize: 22,
    fontWeight: '700'
  },
  button: {
    marginTop: 30
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  iconContainer: {
    marginLeft: 5,
    marginRight: 10,
    borderWidth: 0.5,
    borderRadius: 20,
    padding: 2,
    borderColor: '#909090'
  },
  text: {
    marginTop: 10,
    marginLeft: 10,
    color: '#909090',
    justifyContent: 'center'
  },
  iconText: {
    fontSize: 13
  },
  validationText: {
    color: 'red',
    marginTop: 10,
    fontSize: 14,
    textAlign: 'center'
  }
})
