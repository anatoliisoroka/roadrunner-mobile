import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Share,
  Alert,
  Platform
} from 'react-native'
import Text from 'react-native-text'

import moment from 'moment'

import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'

import { Icon } from 'react-native-elements'

import Button from '../../components/common/Button'

import Backend from '../../utils/Backend'

import PropTypes from 'prop-types'

type Props = {}

//import mapStyle from '../../constants/mapStyle.json'
const FINAL_MAP_MARKER = require('../../assets/icons/garage.png')
const MAP_MARKER = require('../../assets/icons/car.png')

const EDGE_PADDING = {
  top: 20,
  right: 20,
  bottom: 100,
  left: 20
}

export default class Map extends Component<Props> {
  static navigatorStyle = global.Screens.PrimaryNavBarHiddenTabBar
  constructor(props) {
    super(props)

    this.state = {
      showTrackingDetails: false,
      loading: true,
      locations: null
    }
  }

  componentDidMount() {
    this.props.navigator.setTitle({ title: 'SCREEN TITLE' })
  }

  _renderMarker() {
    let { locations } = this.state
    if (locations == null) {
      return null
    }

    return locations.map(location => {
      var image = location.final ? FINAL_MAP_MARKER : MAP_MARKER
      return <Marker image={image} coordinate={location} />
    })
  }

  _renderDirections() {
    let { locations } = this.state
    if (locations == null) {
      return null
    }

    for (var i = 0; i < locations.length; i++) {
      let location = locations[i]
      if (location.final) {
        var destination = {
          latitude: location.latitude,
          longitude: location.longitude
        }
      } else {
        var origin = {
          latitude: location.latitude,
          longitude: location.longitude
        }
      }
    }

    return (
      <MapViewDirections
        origin={origin}
        destination={destination}
        apikey={global.Api.GMapsKey}
        strokeWidth={3}
        strokeColor="#66aaf2"
      />
    )
  }

  _renderDataLoading() {
    return (
      <View
        style={{
          padding: 5
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    )
  }

  render() {
    return (
      <View
        style={{
          flex: 1
        }}
      >
        <MapView
          style={{ flex: 1 }}
          provider={PROVIDER_GOOGLE}
          ref={map => {
            this.map = map
          }}
        ></MapView>
        <View
          style={{
            position: 'absolute',
            bottom: 10,
            right: 10,
            left: 10,
            borderRadius: 30,
            backgroundColor: 'white'
          }}
        ></View>
      </View>
    )
  }
}
