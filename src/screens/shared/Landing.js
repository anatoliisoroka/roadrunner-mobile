import React, { Component } from 'react'
import { StyleSheet, Text, View, Image, ImageBackground } from 'react-native'

import Button from '../../components/shared/Button'

import ConfigHelper from '../../utils/ConfigHelper'

import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin'

import screenStyles from '../../assets/css/screens'

const LOGO = require('../../assets/logos/roadrunner.png')
const BACKGROUND = require('../../assets/images/customer-login.png')
const RESTAURANT_LOGO = require('../../assets/logos/roadrunner.png')
const RESTAURANT_BACKGROUND = require('../../assets/images/venue-login.png')

import DateTime from '../../utils/DateTime'

type Props = {}
export default class Landing extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoading: false,
      background: this._getBackground()
    }
  }

  componentDidMount() {
    this.props.navigator.setStyle({
      navBarHidden: true
    })
  }

  _getBackground() {
    return ConfigHelper.buildName() === global.Config.Restaurant
      ? RESTAURANT_BACKGROUND
      : BACKGROUND
  }

  _getLogo() {
    return ConfigHelper.buildName() === global.Config.Restaurant
      ? RESTAURANT_LOGO
      : LOGO
  }

  _goTo(screen) {
    if (screen === global.Screens.Login) {
      this.props.navigator.push({
        screen
      })
    } else {
      this.props.navigator.resetTo({
        screen
      })
    }
  }

  _renderMainButton() {
    if (ConfigHelper.buildName() === global.Config.Restaurant) {
      title = 'Start'
    } else {
      title = 'Log In'
    }
    return (
      <Button
        title={title}
        style={
          ConfigHelper.buildName() === global.Config.Restaurant
            ? styles.restaurantButton
            : styles.loginButton
        }
        onPress={() => this._goTo(global.Screens.Login)}
      />
    )
  }

  _renderGetStarted() {
    if (ConfigHelper.buildName() === global.Config.Restaurant) {
      return null
    }
    return (
      <Button
        type="secondary"
        title="Get Started"
        style={styles.button}
        onPress={() => this._goTo(global.Screens.LocationPermission)}
      />
    )
  }

  render() {
    return (
      <ImageBackground source={this.state.background} style={styles.background}>
        <Image source={this.state.logo} style={styles.image} />
        {this._renderMainButton()}
        {this._renderGetStarted()}
      </ImageBackground>
    )
  }
}

const styles = StyleSheet.create({
  restaurantButton: {
    marginBottom: 100,
    marginLeft: 50,
    marginRight: 50,
    backgroundColor: global.Colors.Yellow
  },
  loginButton: {
    marginBottom: 10,
    marginLeft: 50,
    marginRight: 50,
    backgroundColor: global.Colors.Yellow
  },
  button: { marginBottom: 60, marginLeft: 50, marginRight: 50 },
  background: { flex: 1, alignItems: 'center' },
  image: {
    marginTop: 10,
    flex: 1,
    resizeMode: 'contain',
    height: 200,
    width: 200
  }
})
