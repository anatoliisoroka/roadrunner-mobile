import Geolocation from 'react-native-geolocation-service'
import {
  Button,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  ToastAndroid,
  View
} from 'react-native'

const TIMEOUT = 1500
const MAXIMUM_AGE = 1000
const PERMISSION_DENIED_ERROR_CODE = 1
const TIMEOUT_ERROR_CODE = 3

export default class GeolocationHelper {
  static hasPermission() {
    return new Promise((resolve, reject) => {
      if (
        Platform.OS === 'ios' ||
        (Platform.OS === 'android' && Platform.Version < 23)
      ) {
        resolve(true)
        return
      }

      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      )
        .then(hasPermission => {
          if (hasPermission) {
            resolve(true)
            return
          }

          return PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
          )
        })
        .then(status => {
          if (status === PermissionsAndroid.RESULTS.GRANTED) {
            resolve(true)
            return
          }

          if (
            status === PermissionsAndroid.RESULTS.DENIED ||
            status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN
          ) {
            reject(
              this._getUserFriendlyError({ code: PERMISSION_DENIED_ERROR_CODE })
            )
            return
          }
        })
    })
  }

  static getTimeoutErrorCode() {
    return TIMEOUT_ERROR_CODE
  }

  static _getUserFriendlyError(error) {
    var message = ''

    switch (error.code) {
      case PERMISSION_DENIED_ERROR_CODE:
        message =
          'Location permission is denied. Please enable it from settings'
        break
      default:
        message = 'Something wrong with your location. Please try later'
    }

    let userFriendlyError = {
      message,
      code: error.code
    }

    return userFriendlyError
  }

  static _getLocation() {
    let params = this._getGeolocationParams()
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        position => {
          let coordinates = position.coords

          resolve(coordinates)
          return
        },
        error => {
          reject(this._getUserFriendlyError(error))
          return
        },
        params
      )
    })
  }

  static _getGeolocationParams() {
    var params = {
      forceRequestLocation: true
    }
    if (Platform.OS === 'ios') {
      params['enableHighAccuracy'] = true
    }

    return params
  }

  static requestLocation() {
    return this.hasPermission().then(hasPermission => {
      if (!hasPermission) {
        throw new Error(
          'Location permission is denied. Please enable it from settings'
        )
      }
      return this._getLocation()
    })
  }
}
