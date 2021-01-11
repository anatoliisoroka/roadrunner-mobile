import { Platform } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'

import FetchHelper from './FetchHelper'
import Backend from './Backend'
import DripHelper from "./DripHelper"
import DataCollection from './DataCollection'

import jwtDecode from 'jwt-decode'
import moment from 'moment'

import { startSplashScreen } from '../screens/index'

var isLoggedIn = false
var accessToken = null
var refreshToken = null
var currentUser = null
var userType = null
var currentUserLocation = null

const KEY_ACCESS_TOKEN = 'accessToken'
const KEY_REFRESH_TOKEN = 'refreshToken'

export default class AuthManager {
  static isAuthenticated() {
    return AuthManager.isLoggedIn
  }

  static getAccessToken() {
    return AuthManager.accessToken
  }

  static getCurrentUser() {
    return AuthManager.currentUser
  }

  static isCustomer() {
    return AuthManager.userType == 'customer'
  }

  static getCurrentUserLocation() {
    return AuthManager.currentUserLocation
  }

  static setCurrentUserLocation(location) {
    AuthManager.currentUserLocation = location
    DripHelper.trackUserLocation(location)
  }

  static _hasError(responseJson) {
    let hasError = false
    let tokens = responseJson.tokens

    if (!tokens) {
      hasError = true
    }

    if (tokens.length === 0) {
      hasError = true
    }

    if (!tokens.access) {
      hasError = true
    }

    if (!tokens.refresh) {
      hasError = true
    }

    return hasError
  }

  static registerCustomer(data) {
    return FetchHelper.post(global.Api.Customers, data, false, false)
      .then(responseJson => {
        if (this._hasError(responseJson)) {
          throw AuthManager.getError(responseJson)
        }
        AuthManager._updateTokens(responseJson.tokens)
        AuthManager._setUser(responseJson)
        DripHelper.trackUser()
        return responseJson
      })
      .catch(error => {
        throw AuthManager.getError(error)
      })
  }

  static login(email, password) {
    data = { email, password }
    return FetchHelper.post(global.Api.Login, data, false, false)
      .then(responseJson => {
        if (this._hasError(responseJson)) {
          throw AuthManager.getError(responseJson)
        }
        AuthManager._updateTokens(responseJson.tokens)
        AuthManager._setUser(responseJson)
        DripHelper.trackUser()
        return responseJson
      })
      .catch(error => {
        throw AuthManager.getError(error)
      })
  }

  static socialLogin(provider, code, redirectUri) {
    let data = {
      provider,
      code,
      redirect_uri: redirectUri
    }
    return FetchHelper.post(global.Api.SocialLogin, data, false, false).then(
      responseJson => {
        if (this._hasError(responseJson)) {
          throw AuthManager.getError(responseJson)
        }
        AuthManager._updateTokens(responseJson.tokens)
        AuthManager._setUser(responseJson)

        return responseJson
      }
    )
  }

  static _getMinutesUntilTokenExpiration() {
    var decodedJWT = jwtDecode(AuthManager.accessToken)
    var exp = decodedJWT.exp * 1000
    var expirationTime = moment(exp)
    var today = moment()
    let absoluteDifference = Math.abs(expirationTime.diff(today, 'minutes'))
    return absoluteDifference
  }

  static async validateTokens(onSuccess, onError) {
    let remainingMinutes = AuthManager._getMinutesUntilTokenExpiration()
    if (remainingMinutes > 1) {
      onSuccess()
      return
    }
    return AuthManager.refreshTokens(() => {
      return onSuccess()
    }).catch(error => {
      onError()
      startOnboardingScreen('Token is expired. Please sign in.')
    })
  }

  static refreshTokens() {
    return AsyncStorage.getItem(KEY_REFRESH_TOKEN)
      .then(refreshToken => {
        if (!refreshToken) {
          throw { message: 'No Refresh Token Found' }
          return
        }
        // try and refresh the token if we find it, if this fails
        // our token has expired and we will need user to re login
        // manually
        const data = { refresh: refreshToken }

        return FetchHelper.post(global.Api.RefreshToken, data, false, false)
      })
      .then(tokenResponse => {
        return AuthManager._updateTokens(tokenResponse)
      })
  }

  static silentLogin() {
    return AuthManager.refreshTokens()
      .then(() => {
        return FetchHelper.get(global.Api.UserInfo)
      })
      .then(responseJson => {
        AuthManager._setUser(responseJson)
        return AuthManager.currentUser
      })
      .catch(error => {
        AuthManager.accessToken = null
        AuthManager.refreshToken = null
        throw error
      })
  }

  static refreshCurrentUser() {
    return FetchHelper.get(global.Api.UserInfo)
      .then(responseJson => {
        AuthManager._setUser(responseJson)
        return AuthManager.currentUser
      })
      .catch(error => {
        throw error
      })
  }

  static async logOut() {
    let data = { refresh: AuthManager.refreshToken }

    return Backend.removeToken()
      .then(() => {
        return FetchHelper.post(global.Api.User.Logout, data)
      })
      .then(() => {
        DataCollection.track(global.Event.SIGN_OUT)
        return AuthManager.removeCredentials()
      })
      .catch(error => {
        DataCollection.track(global.Event.SIGN_OUT)
        return AuthManager.removeCredentials()
      })
  }

  static requestResetPassword(email) {
    return FetchHelper.post(
      global.Api.RequestResetPassword,
      {
        email
      },
      false,
      false
    )
  }

  static resetPassword(email, password, code) {
    data = {
      email,
      password,
      verification_code: code
    }
    return FetchHelper.post(global.Api.ResetPassword, data, false, false)
  }

  static removeCredentials() {
    AuthManager.accessToken = null
    AuthManager.refreshToken = null
    AuthManager.isLoggedIn = false
    AuthManager.currentUser = null
    AuthManager.userType = null
    AsyncStorage.removeItem(KEY_ACCESS_TOKEN)
    return AsyncStorage.removeItem(KEY_REFRESH_TOKEN)
  }

  static getError(error) {
    var errorMessage = 'An unexpected error occured'
    if (error.email) {
      errorMessage = error.email[0]
    } else if (error.message) {
      errorMessage = error.message
    } else if (error.non_field_errors) {
      errorMessage = error.non_field_errors[0]
    } else if (error.detail) {
      errorMessage = error.detail
    }
    return { error: errorMessage, message: errorMessage }
  }

  static _updateTokens(tokens) {
    AuthManager.accessToken = tokens.access
    AuthManager.refreshToken = tokens.refresh
    AsyncStorage.setItem(KEY_ACCESS_TOKEN, AuthManager.accessToken)
    AsyncStorage.setItem(KEY_REFRESH_TOKEN, AuthManager.refreshToken)
  }

  static _setUser(responseJson) {
    AuthManager.isLoggedIn = true
    if (responseJson.customer) {
      AuthManager.currentUser = responseJson.customer
      AuthManager.userType = 'customer'
    }else{
      AuthManager.currentUser = responseJson.company_member
      AuthManager.userType = 'company_member'
    }
    DataCollection.setUser(AuthManager.currentUser.user)
    DataCollection.track(global.Event.SIGN_IN)

  }

  static getHeaders(contentType = 'application/json') {
    var headers = { 'Content-Type': contentType }
    if (AuthManager.accessToken) {
      headers['Authorization'] = 'Bearer ' + AuthManager.accessToken
    }

    return new Headers(headers)
  }
}
