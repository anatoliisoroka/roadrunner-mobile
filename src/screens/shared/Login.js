import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  Image,
  View,
  ScrollView,
  Alert,
  Platform
} from 'react-native'

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import screenStyles from '../../assets/css/screens'

import Feather from 'react-native-vector-icons/Feather'

import LogoBanner from '../../components/shared/LogoBanner'
import TextField from '../../components/shared/TextField'
import Button from '../../components/shared/Button'
import SocialLoginButton from '../../components/shared/SocialLoginButton'

import LoadingView from '../../components/shared/LoadingView'

import ConfigHelper from '../../utils/ConfigHelper'
import AuthManager from '../../utils/AuthManager'
import DripHelper from "../../utils/DripHelper"

type Props = {}
const LOGO = require('../../assets/logos/roadrunner.png')
export default class Login extends Component<Props> {
  static navigatorStyle = global.Screens.PrimaryNavBar

  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      data: null,
      showCreateAccount: props.showCreateAccount,
      orderDetails: props.basket
    }

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this))
  }

  componentDidMount() {
    this._setupCloseButton()
    if (ConfigHelper.buildName() === global.Config.Restaurant) {
      this.props.navigator.setTitle({ title: 'Log In' })
      return
    }
  }

  _setupCloseButton() {
    if (this.props.commandType === 'ShowModal') {
      Feather.getImageSource('x', 28).then(close => {
        this.props.navigator.setButtons({
          rightButtons: [
            {
              icon: close,
              id: 'close'
            }
          ],
          animated: true
        })
      })
    }
  }

  onNavigatorEvent(event) {
    if (event.type == 'NavBarButtonPress') {
      if (event.id == 'close') {
        this._dismissModal()
      }
    }
  }

  _handleLogin() {
    if (!this._isFormValid()) {
      return
    }
    this._login()
  }

  _dismissModal() {
    this.props.onDismissed()
    this.props.navigator.dismissModal()
  }

  _login() {
    this.setState({ isLoading: true })
    let { email, password } = this.state.data
    AuthManager.login(email, password)
      .then(user => {
        this.setState({ isLoading: false })
        this._handleLoggedIn(user)
      })
      .catch(error => {
        this.setState({ isLoading: false })
        Alert.alert('Oops', error.message)
      })
  }

  _handleLoggedIn(user){
    if (ConfigHelper.buildName() === global.Config.Customer) {
      if (!user.customer) {
        alert('Only customer accounts can use this app')
        return
      }
      if (this.state.orderDetails != null) {
        DripHelper.trackBasket()
        this._dismissModal()
      }
      this._goTo(global.Screens.LocationPermission)
      return
    }
    if (!user.company_member) {
      alert('Only company accounts can use this app')
      return
    }
    this._goTo(global.Screens.VenueOrders)
  }

  _updateData(key, value) {
    let data = { ...this.state.data }
    data[key] = value
    this.setState({ data })
  }

  _isFormValid() {
    let isValid = true

    if (!this.refs.tfEmail.isValid()) {
      isValid = false
    }
    return isValid
  }

  _goTo(screen) {
    this.props.navigator.resetTo({
      screen
    })
  }

  _renderLogoBanner() {
    if (ConfigHelper.buildName() === global.Config.Customer) {
      return (
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Log In</Text>
        </View>
      )
    }
    return <Image source={LOGO} style={styles.logo} />
  }

  _renderCreateAccountButton() {
    if (
      ConfigHelper.buildName() === global.Config.Restaurant ||
      !this.state.showCreateAccount
    ) {
      return null
    }
    let screen =
      Platform.OS == 'ios'
        ? global.Screens.CreateAccount
        : global.Screens.SignUp
    return (
      <Button
        type="tertiary"
        title="Create Account"
        onPress={() => this.props.navigator.push({ screen })}
      />
    )
  }

  render() {
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={screenStyles.centerHorizontalPaddedContainer}
      >
        {this._renderLogoBanner()}
        <TextField
          ref="tfEmail"
          type="email"
          placeholder="Email"
          containerStyle={styles.inputContainer}
          textStyle={styles.inputText}
          onChangeText={email => {
            this._updateData('email', email)
          }}
        />
        <TextField
          ref="tfPassword"
          placeholder="Password"
          type="password"
          containerStyle={styles.inputContainer}
          textStyle={styles.inputText}
          onChangeText={password => {
            this._updateData('password', password)
          }}
        />

        <Button
          title="Log In"
          style={styles.button}
          onPress={() => this._handleLogin()}
        />

        <SocialLoginButton
          provider="google"
          onLoggedIn={user => this._handleLoggedIn(user)}
        />

        <SocialLoginButton
          provider="facebook"
          onLoggedIn={user => this._handleLoggedIn(user)}
        />

        {this._renderCreateAccountButton()}
        <Button
          type="quaternary"
          title="Forgot Password"
          style={{ marginTop: 20 }}
          onPress={() =>
            this.props.navigator.push({ screen: global.Screens.ForgotPassword })
          }
        />
        <LoadingView isLoading={this.state.isLoading} />
      </KeyboardAwareScrollView>
    )
  }
}

Login.onDefaultProps = {
  onDismissed: () => {}
}

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: '#F7F7F7',
    borderRadius: 5,
    borderBottomColor: 'transparent',
    height: 50,
    justifyContent: 'center'
  },
  inputText: { marginLeft: 10 },
  logo: { marginTop: 80, marginBottom: 20, height: 200, width: 200 },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '35%'
  },
  title: {
    fontSize: 20,
    fontWeight: '700'
  },
  button: {
    marginTop: 30
  }
})
