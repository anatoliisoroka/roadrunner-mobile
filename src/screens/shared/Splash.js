import React, { Component } from 'react'
import { StyleSheet, Text, View, ImageBackground, AppState } from 'react-native'

import LogoBanner from '../../components/shared/LogoBanner'

import { startApp } from '../../screens'

import Video from 'react-native-video'

import PushNotification from 'react-native-push-notification'
import AuthManager from '../../utils/AuthManager'
import ConfigHelper from '../../utils/ConfigHelper'
import Notifications from '../../utils/Notifications'
import LocalStorageHelper from '../../utils/LocalStorageHelper'
import DataCollection from '../../utils/DataCollection'
import Backend from "../../utils/Backend"
import DripHelper from "../../utils/DripHelper"

import crashlytics from '@react-native-firebase/crashlytics';

import screenStyles from '../../assets/css/screens'

const SPLASH_DURATION = 1000

const VIDEO_PART_1 = require('../../assets/videos/splash-part-1.mp4')
const VIDEO_PART_2 = require('../../assets/videos/splash-part-2.mp4')

export default class Splash extends Component {
  constructor(props) {
    super(props)
    this.state = {
      video: VIDEO_PART_1,
      isSilentLoginFailed: null,
      hasOnboarded: null,
      appState: AppState.currentState
    }
  }

  componentDidMount() {
    crashlytics().log('App start.');
    DataCollection.track(global.Event.APP_OPENED)
    AppState.addEventListener('change', this._handleAppStateChange)
    LocalStorageHelper.retrieve(global.StorageKeys.hasOnboarded).then(
      hasOnboarded => {
        this.setState({ hasOnboarded })
      }
    )

    PushNotification.popInitialNotification(notification => {
      if (notification === null) {
        this._handleSilentLogin()
        return
      }
      this.setState({ notification }, () => {
        AuthManager.silentLogin()
          .then(user => {
            this._handleNotification(user, notification)
          })
          .catch(error => {
            this.setState({ isSilentLoginFailed: true })
          })
      })
    })
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange)
  }

  _handleAppStateChange = (nextAppState) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      if (this.player) {
        this.player.setNativeProps({
          rate: 1
        })
      }
    }
    this.setState({ appState: nextAppState })
  }

  _handleSilentLogin() {
    AuthManager.silentLogin()
      .then(() => {
        this.setState({ isSilentLoginFailed: false })
        return
      })
      .catch(error => {
        this.setState({ isSilentLoginFailed: true })
      })
  }

  _handleNotification(user, notification) {
    Backend.getOrder(notification.order_id)
      .then(order => {
        global.General.InitialOrder = order
        this.setState({ isSilentLoginFailed: false })
      })
      .catch(error => {
        this.setState({ isSilentLoginFailed: true })
      })
  }

  _onSilentLogin() {
    this._handleUpdatedDeviceToken()
    DripHelper.trackUser()

    if (ConfigHelper.buildName() === global.Config.Restaurant) {
      this._resetTo(global.Screens.VenueOrders)
      return
    }

    this._resetTo(global.Screens.LocationPermission)
  }

  _handleUpdatedDeviceToken() {
    Notifications.hasPermission().then(hasPermission => {
      if (hasPermission) {
        Notifications.requestPermission()
      }
    })
  }

  _onFailedSilentLogin() {
    let { hasOnboarded } = this.state
    if (this._isVenueApp()) {
      this._resetTo(global.Screens.Login)
      return
    }

    if (hasOnboarded) {
      this._resetTo(global.Screens.Landing, 'fade')
    } else {
      this._resetTo(global.Screens.Landing, 'fade')
      // this._resetTo(global.Screens.Onboarding)
    }
  }

  _resetTo(screen, animationType = 'none') {
    this.props.navigator.resetTo({
      screen,
      animationType
    })
  }

  _isVenueApp() {
    return ConfigHelper.buildName() === global.Config.Restaurant
  }
  _onVideoEnded() {
    let { isSilentLoginFailed, video, hasOnboarded } = this.state

    if (video == VIDEO_PART_1) {
      if (
        !isSilentLoginFailed ||
        (isSilentLoginFailed && (this._isVenueApp() || !hasOnboarded))
      ) {
        this.setState({ video: VIDEO_PART_2 })
        return
      }
    }
    if (!isSilentLoginFailed) {
      this._onSilentLogin()
      return
    }

    this._onFailedSilentLogin()
  }

  render() {
    let { video } = this.state
    return (
      <Video
        style={[screenStyles.fullScreen, { backgroundColor: '#43237C' }]}
        ref={ref => {
          this.player = ref
        }}
        resizeMode={'cover'}
        repeat={false}
        source={video}
        onEnd={() => {
          this._onVideoEnded()
        }}
      />
    )
  }
}

const styles = StyleSheet.create({
  color: { backgroundColor: global.Colors.Primary }
})
