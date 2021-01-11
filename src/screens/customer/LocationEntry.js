import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Image,
  PermissionsAndroid,
  Platform
} from 'react-native'

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import LocationSearch from '../../components/shared/LocationSearch'

import Button from '../../components/shared/Button'

import TextField from '../../components/shared/TextField'

import { FormInput, Icon } from 'react-native-elements'

import AuthManager from '../../utils/AuthManager'

import screenStyles from '../../assets/css/screens'

const LOGO = require('../../assets/icons/mosaic-wheel.png')
const LOCATION = require('../../assets/icons/location.png')

export default class LocationEntry extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      location: null
    }
  }

  componentDidMount() {
    this.props.navigator.setStyle({
      navBarHidden: true
    })
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

  _onSubmitButtonPressed() {
    let { location } = this.state

    if (!location) {
      alert('Please enter an address')
      return
    }
    AuthManager.setCurrentUserLocation(location)
    this._onSuccess()
  }

  render() {
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={screenStyles.centerHorizontalPaddedContainer}
      >
        <View style={styles.topContainer}>
          <Text style={styles.largeText}>
            We understand that you don't want us to know your location.
          </Text>
          <Text style={styles.subtitle}>
            We do need to know an address to provide our service to you.
          </Text>
        </View>
        <View style={styles.bottomContainer}>
          <LocationSearch
            ref={locationField => (this.locationField = locationField)}
            onPlaceSelected={selectedLocation => {
              let location = {
                longitude: selectedLocation.longitude,
                latitude: selectedLocation.latitude
              }

              this.setState({ location })
            }}
          />
        </View>
        <Button
          type="tertiary"
          title="Get Started"
          style={styles.button}
          onPress={() => this._onSubmitButtonPressed()}
        />
      </KeyboardAwareScrollView>
    )
  }
}

const styles = StyleSheet.create({
  largeText: {
    fontWeight: '500',
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
    paddingLeft: 4,
    paddingRight: 4
  },
  subtitle: {
    fontWeight: '200',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    paddingLeft: 30,
    paddingRight: 30
  },
  topContainer: { flex: 1, width: '100%', justifyContent: 'center' },
  bottomContainer: { width: '100%', justifyContent: 'flex-end' },
  button: {
    marginLeft: 50,
    marginRight: 50,
    marginBottom: 50,
    marginTop: 40
  }
})
