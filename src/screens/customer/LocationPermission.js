import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Image,
  PermissionsAndroid,
  Alert,
  Platform
} from 'react-native'

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import Button from '../../components/shared/Button'

import Geolocation from '../../utils/Geolocation'
import AuthManager from '../../utils/AuthManager'
import LocalStorageHelper from '../../utils/LocalStorageHelper'

import screenStyles from '../../assets/css/screens'

const IMAGE = require('../../assets/images/map.png')
export default class LocationPermission extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      locationPermissionAsked: false
    }
  }

  componentDidMount() {
    this.props.navigator.setStyle({
      navBarHidden: true
    })

    this._initializeLocationIfNecessary()
  }

  _initializeLocationIfNecessary() {
    var currentUser = AuthManager.getCurrentUser()
    if (currentUser) {
      if (currentUser.last_order_location != null) {
        this._setUserLocation(currentUser.last_order_location)
        return
      } else if (currentUser.locations.length > 0) {
        this._setUserLocation(currentUser.locations[0])
        return
      }
    }

    LocalStorageHelper.hasLocationPermissionAsked().then(
      locationPermissionAsked => {
        if (!locationPermissionAsked) {
          return
        }

        this._getLocationIfPermissionAllowed()
      }
    )
  }

  _onSuccess() {
    let customer = AuthManager.getCurrentUser()
    if (customer && !customer.user.phone_verified) {
      this._goTo(global.Screens.PhoneVerification, {
        onPhoneVerified: () => {
          this.props.navigator.resetTo({
            screen: global.Screens.Menu
          })
        }
      })
      return
    }
    this.props.navigator.resetTo({
      screen: global.Screens.Menu
    })
  }

  _goTo(screen, passProps = {}) {
    this.props.navigator.push({
      screen,
      passProps
    })
  }

  _setInitialRegion() {
    this._getLocation().then(position => {
      let location = {
        longitude: position.coords.longitude,
        latitude: position.coords.latitude
      }
    })
  }

  _getLocationIfPermissionAllowed() {
    Geolocation.hasPermission()
      .then(hasPermission => {
        if (!hasPermission) {
          return
        }
        return this._getLocation()
      })
      .catch(error => {
        setTimeout(() => {
          this._goTo(global.Screens.LocationEntry)
        }, 0)
      })
  }

  _getLocation() {
    Geolocation.requestLocation()
      .then(location => {
        LocalStorageHelper.locationPermissionAsked()
        this._setUserLocation(location)
      })
      .catch(error => {
        if (error.code == Geolocation.getTimeoutErrorCode()) {
          return
        }
        alert(error.message)
        LocalStorageHelper.locationPermissionAsked()
        this._goTo(global.Screens.LocationEntry)
      })
  }

  _setUserLocation(location) {
    AuthManager.setCurrentUserLocation(location)
    this._onSuccess()
  }

  render() {
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={screenStyles.centerHorizontalPaddedContainer}
      >
        <Image source={IMAGE} style={{ marginTop: 80, marginBottom: 20 }} />
        <Text
          style={{
            fontWeight: '500',
            fontSize: 17,
            marginBottom: 20,
            textAlign: 'center',
            paddingLeft: 4,
            paddingRight: 4
          }}
        >
          Please allow us to use your location.
        </Text>
        <Text style={{ fontWeight: '200', fontSize: 16 }}>
          You can change this in Settings at any time
        </Text>

        <View style={{ flex: 1, width: '100%', justifyContent: 'flex-end' }}>
          <Button
            type="tertiary"
            title="Next"
            style={{
              marginLeft: 50,
              marginRight: 50,
              marginBottom: 50
            }}
            onPress={() => this._getLocation()}
          />
        </View>
      </KeyboardAwareScrollView>
    )
  }
}
