import React, { Component } from 'react'
import {
  View,
  Alert,
  Platform,
  StyleSheet
} from 'react-native'

import { GoogleSignin, statusCodes } from 'react-native-google-signin'
import { LoginManager, AccessToken } from 'react-native-fbsdk'

import Button from './Button'
import Backend from '../../utils/Backend'
import AuthManager from '../../utils/AuthManager'

export default class SocialLoginButton extends Component {
  constructor(props) {
    super(props)
    this.state = {
      show: Platform.OS != 'ios',
      provider: props.provider,
    }
  }

  componentDidMount(){
    GoogleSignin.configure({
      webClientId: global.General.GoogleWebClientId,
      offlineAccess: true,
      iosClientId: global.General.GoogleiOSClientId,
      androidClientId: global.General.GoogleAndroidClientId
    })
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps)
  }

  _isProviderGoogle(){
    return this.state.provider == "google"
  }

  _onLoginPressed(){
    if(this._isProviderGoogle()){
      this._onLoginWithGooglePressed()
    }
    else{
      this._onLoginWithFacebookPressed()
    }
  }

  _onLoginWithFacebookPressed() {
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
        this.props.onLoggedIn(user)
      })
      .catch(error => {
        this._handleError(error)
      })
  }

  _onLoginWithGooglePressed() {
    GoogleSignin.signOut()
    return GoogleSignin.hasPlayServices()
      .then(() => {
        return GoogleSignin.signIn()
      })
      .then(response => {
        return AuthManager.socialLogin(
          global.General.GoogleProvider,
          response.serverAuthCode,
          global.Api.Google.RedirectUri
        )
      })
      .then(user => {
        this.props.onLoggedIn(user)
      })
      .catch(error => {
        this._handleError(error)
      })
  }

  _handleError(error){
    console.log('bbb', error)
    Alert.alert(
      'Oops',
      'There was an issue logging you in. Please make sure you are connected to the internet or try another login method.'
    )
  }

  render() {
    let {
      show,
      provider
    } = this.state

    if(!show){
      return null
    }

    let title = this._isProviderGoogle() ? "Google" : "Facebook"
    return (
      <Button
        title={"Login With "+title}
        style={styles.button}
        textStyle={styles.buttonText}
        onPress={() => this._onLoginPressed()}
      />
    )
  }
}

const styles = StyleSheet.create({
  buttonText: {
    fontSize: 15,
    color: global.Colors.Primary
  },
  button: {
    backgroundColor: 'transparent',
    borderColor: global.Colors.Primary,
    borderWidth: 2,
    marginTop: 10,
    marginBottom: 10
  }
})
