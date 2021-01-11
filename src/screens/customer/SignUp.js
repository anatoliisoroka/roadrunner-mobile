import React, { Component } from 'react'
import {
  StyleSheet,
  Platform,
  View,
  Text,
  Image,
  TextInput
} from 'react-native'

import Backend from '../../utils/Backend'
import AuthManager from '../../utils/AuthManager'

import Button from '../../components/shared/Button'

import { GoogleSignin, statusCodes } from 'react-native-google-signin'
import { LoginManager, AccessToken } from 'react-native-fbsdk'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import moment from 'moment'

import screenStyles from '../../assets/css/screens'

const IMAGE = require('../../assets/images/password.png')

type Props = {}
export default class SignUp extends Component<Props> {
  static navigatorStyle = global.Screens.PrimaryNavBar
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    GoogleSignin.configure({
      webClientId: global.General.GoogleWebClientId,
      offlineAccess: true,
      iosClientId: global.General.GoogleiOSClientId,
      androidClientId: global.General.GoogleAndroidClientId
    })
    this.props.navigator.setTitle({ title: 'Sign Up' })
  }

  _goTo(screen) {
    this.props.navigator.push({
      screen
    })
  }

  _dismissModal() {
    this.props.navigator.dismissModal()
  }

  _onLoginWithGooglePressed() {
    GoogleSignin.signOut()
    return GoogleSignin.hasPlayServices()
      .then(() => {
        return GoogleSignin.signIn()
      })
      .then(response => {
        console.log('aaa', response)
        return AuthManager.socialLogin(
          global.General.GoogleProvider,
          response.serverAuthCode,
          global.Api.Google.RedirectUri
        )
      })
      .then(user => {
        if (user.customer.cards.length == 0) {
          this._goTo(global.Screens.CreatePayment)
          return
        }
        this._dismissModal()
      })
      .catch(error => {
        console.log('bbb', error)
        Alert.alert(
          'Oops',
          'There was an issue logging you in. Please make sure you are connected to the internet or try another login method.'
        )
      })
  }

  _openFacebookDialog() {
    LoginManager.logOut()
    LoginManager.logInWithPermissions(['public_profile', 'email'])
      .then(result => {
        if (result.isCancelled) {
          throw new Exception({ error: 'error', message: 'Login cancelled' })
        }
        return AccessToken.getCurrentAccessToken()
      })
      .then(data => {
        return Backend.getFacebookCode(
          data.accessToken.toString(),
          global.Api.Facebook.RedirectUri
        )
      })
      .then(response => {
        return AuthManager.socialLogin(
          global.General.FacebookProvider,
          response.code,
          global.Api.Facebook.RedirectUri
        )
      })
      .then(user => {
        if (user.customer.cards.length == 0) {
          this._goTo(global.Screens.CreatePayment)
          return
        }
        this._dismissModal()
      })
      .catch(error => {
        console.log('eeeee', error)
        alert('An unexpected error occured, please try again')
      })
  }

  render() {
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={screenStyles.centerHorizontalPaddedContainer}
      >
        <Image source={IMAGE} style={{ marginTop: '5%' }} />
        <Text style={styles.text}>
          We only use your data to help us improve your experience with our app.
        </Text>
        <View style={styles.footerContainer}>
          <Button
            title="Facebook"
            style={styles.button}
            textStyle={styles.buttonText}
            onPress={() => this._openFacebookDialog()}
          />
          <Button
            title="Google"
            style={styles.button}
            textStyle={styles.buttonText}
            onPress={() => this._onLoginWithGooglePressed()}
          />
          <Text style={styles.smallText}>or</Text>
          <Button
            title="Email"
            onPress={() => this._goTo(global.Screens.CreateAccount)}
          />
        </View>
      </KeyboardAwareScrollView>
    )
  }
}

const styles = StyleSheet.create({
  text: {
    fontWeight: '500',
    fontSize: 17,
    marginBottom: 2,
    textAlign: 'center'
  },
  subTitle: {
    fontWeight: '100',
    marginTop: 20,
    fontSize: 16,
    marginBottom: 2,
    textAlign: 'center'
  },
  footerContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 20
  },
  bottomButtonContainer: {
    width: '100%',
    flexDirection: 'row',
    marginTop: 15
  },
  buttonText: {
    fontSize: 15,
    color: global.Colors.Primary
  },
  smallText: {
    fontWeight: '300',
    fontSize: 15,
    color: '#909090',
    marginBottom: 10
  },
  button: {
    backgroundColor: 'transparent',
    borderColor: global.Colors.Primary,
    borderWidth: 2,
    marginTop: 10,
    marginBottom: 10
  }
})
