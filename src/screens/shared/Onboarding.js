import React, { Component } from 'react'
import { Platform, StyleSheet, Text, View } from 'react-native'

import { Navigation } from 'react-native-navigation'

import LogoBanner from '../../components/shared/LogoBanner'
import Pager from '../../components/shared/Pager'

import { Icon } from 'react-native-elements'

import screenStyles from '../../assets/css/screens'
import styles from '../../assets/css/main'

import LocalStorageHelper from '../../utils/LocalStorageHelper'

const INTRO_IMAGE_1 = require('../../assets/images/screen1.png')
const INTRO_IMAGE_2 = require('../../assets/images/screen2.png')
const INTRO_IMAGE_3 = require('../../assets/images/screen3.png')

type Props = {}
export default class Onboarding extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pages: [
        {
          image: INTRO_IMAGE_1,
          title: 'Good food made by your favourite restaurant in your area!'
        },
        {
          image: INTRO_IMAGE_2,
          title: 'Delivered straight to your door or wherever you may be!'
        },
        {
          image: INTRO_IMAGE_3,
          title: 'For your friends, your family, or for yourself to enjoy!'
        }
      ]
    }
  }

  componentDidMount() {
    this.props.navigator.setStyle({
      navBarHidden: true
    })
  }

  _goTo() {
    LocalStorageHelper.save(global.StorageKeys.hasOnboarded, true)
    this.props.navigator.resetTo({
      screen: global.Screens.Landing
    })
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center' }}>
        <Pager pages={this.state.pages} _goTo={() => this._goTo()} />
      </View>
    )
  }
}
