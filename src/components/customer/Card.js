import React, { Component } from 'react'
import { Platform, View, Text, Image, TextInput } from 'react-native'

import LinearGradient from 'react-native-linear-gradient'

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import moment from 'moment'

import screenStyles from '../../assets/css/screens'

const VISA = require('../../assets/images/visa.png')
const MASTERCARD = require('../../assets/images/mastercard.png')

type Props = {}
export default class Card extends Component<Props> {
  static navigatorStyle = global.Screens.SecondaryNavBar
  constructor(props) {
    super(props)
    this.state = {
      defaultCard: props.defaultCard,
      description: ''
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps)
  }

  _renderImage() {
    if (this.state.defaultCard.brand === 'mastercard') {
      source = MASTERCARD
    } else if (this.state.defaultCard.brand === 'visa') {
      source = VISA
    } else {
      source = null
    }
    return (
      <Image
        style={{ position: 'absolute', top: 2, right: 20 }}
        source={source}
      />
    )
  }

  _renderHiddenNumbers() {
    return <Text style={{ color: 'white', marginRight: 10 }}>●●●●</Text>
  }

  render() {
    let { defaultCard } = this.state
    if (defaultCard == null) {
      return null
    }
    return (
      <View>
        <LinearGradient
          start={{ x: 0.7, y: 0.5 }}
          end={{ x: 0.5, y: 1.0 }}
          colors={['#A4006C', '#440099']}
          style={{
            flex: 1,
            height: 190,
            borderRadius: 10,
            justifyContent: 'flex-end',
            paddingBottom: 30,
            marginBottom: 30
          }}
        >
          {this._renderImage()}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingLeft: 40,
              paddingRight: 40,
              marginBottom: 20
            }}
          >
            {this._renderHiddenNumbers()}
            {this._renderHiddenNumbers()}
            {this._renderHiddenNumbers()}
            <Text style={{ color: 'white', fontSize: 15, fontWeight: '700' }}>
              {defaultCard.last_four}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingLeft: 40,
              paddingRight: 40
            }}
          >
            <View>
              <Text style={{ color: '#BBC7BA', marginBottom: 5, fontSize: 10 }}>
                CARDHOLDER NAME
              </Text>
              <Text style={{ color: 'white', fontSize: 15, fontWeight: '700' }}>
                {defaultCard.name}
              </Text>
            </View>
            <View>
              <Text style={{ color: '#BBC7BA', marginBottom: 5, fontSize: 10 }}>
                EXPIRES
              </Text>
              <Text style={{ color: 'white', fontSize: 15, fontWeight: '700' }}>
                {defaultCard.expiry_month}/{defaultCard.expiry_year}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </View>
    )
  }
}
