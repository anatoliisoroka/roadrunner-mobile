import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Alert,
  Platform,
  Image
} from 'react-native'
import Text from 'react-native-text'

import moment from 'moment'

import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'
import { ifIphoneX } from 'react-native-iphone-x-helper'

import List from '../../utils/List'

import PropTypes from 'prop-types'

type Props = {}

import mapStyle from '../../constants/mapStyle.json'
const VENUE_MARKER = require('../../assets/icons/restaurant.png')
const MAP_MARKER = require('../../assets/icons/marker.png')
const ANIMATE_TO_REGION_DURATION = 1600
const EDGE_PADDING = {
  top: 20,
  right: 20,
  bottom: 100,
  left: 20
}

const INITIAL_POSITION = {
  latitude: 54.607868,
  longitude: -5.926437,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421
}
const NO_LOCATIONS_DELTA = {
  latitudeDelta: 0.4,
  longitudeDelta: 0.4
}

const DEFAULT_DELTA = {
  latitudeDelta: 0.04,
  longitudeDelta: 0.04
}

export default class Map extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isMapReady: false,
      type: props.type,
      initialLocationBelongsToVenue: props.initialLocationBelongsToVenue,
      loading: props.loading,
      locations: null,
      initialPosition: props.initialPosition,
      region: null,
      location: this._getLocation(props)
    }
    this._setRegion()
  }

  componentWillReceiveProps(nextProps) {
    this.setState(
      { ...nextProps, location: this._getLocation(nextProps) },
      () => {
        this._setRegion()
      }
    )
  }

  _getLocation(props) {
    let delta = List.isNullOrEmpty(props.locations)
      ? NO_LOCATIONS_DELTA
      : DEFAULT_DELTA

    let location = {
      latitude: props.latitude,
      longitude: props.longitude,
      ...delta
    }
    return location
  }

  _setRegion() {
    let timeoutDuration = this.state.isMapReady ? 0 : 1000
    setTimeout(() => {
      let location = this._getPosition()

      this.setState({ region: location }, () => {
        this._animateToRegion(location)
      })
    }, timeoutDuration)
  }

  _animateToRegion(newLocation) {
    let { isMapReady, initialLocationBelongsToVenue } = this.state

    if (!isMapReady || initialLocationBelongsToVenue) {
      return
    }

    setTimeout(
      () => this.map.animateToRegion(newLocation, ANIMATE_TO_REGION_DURATION),
      1000
    )
  }

  _setDelta(location) {
    let { locations, initialLocationBelongsToVenue } = this.state

    let delta = List.isNullOrEmpty(locations)
      ? NO_LOCATIONS_DELTA
      : DEFAULT_DELTA

    if (initialLocationBelongsToVenue) {
      delta = DEFAULT_DELTA
    }

    let locationWithDelta = {
      ...location,
      ...delta
    }

    return locationWithDelta
  }

  _renderMapLoading() {
    let { loading } = this.state
    if (!loading) {
      return null
    }
    return (
      <View
        style={[
          this._getStyle(),
          { justifyContent: 'center', alignItems: 'center' }
        ]}
      >
        <ActivityIndicator animating={this.state.loading} size="small" />
        <Text style={{ paddingLeft: 8, color: 'grey' }}>
          {this.state.loading ? 'Searching' : ''}
        </Text>
      </View>
    )
  }

  _renderMarkers() {
    let { locations, isMapReady } = this.state
    if (locations == null || !isMapReady) {
      return null
    }

    return locations.map(location => {
      return (
        <Marker coordinate={location} title={location.title}>
          <Image source={VENUE_MARKER} style={{ resizeMode: 'contain' }} />
        </Marker>
      )
    })
  }

  _getPosition() {
    let { location, initialPosition } = this.state

    if (location.latitude != null && location.longitude != null) {
      let locationWithDelta = this._setDelta(location)
      return locationWithDelta
    }

    let initialPositionWithDelta = this._setDelta(initialPosition)

    return initialPositionWithDelta
  }

  _renderCurrentLocation() {
    let { isMapReady, initialLocationBelongsToVenue } = this.state
    if (!isMapReady) {
      return null
    }
    let marker = initialLocationBelongsToVenue ? VENUE_MARKER : MAP_MARKER

    return (
      <Marker image={marker} coordinate={this._getPosition()}>
        <Image source={marker} style={{ resizeMode: 'contain' }} />
      </Marker>
    )
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
        strokeColor={global.Colors.Secondary}
      />
    )
  }

  _getStyle() {
    switch (this.state.type) {
      case 'full':
        return styles.fullWidth
      case 'padded':
        return styles.padded
      default:
        return styles.fullWidth
    }
  }

  render() {
    let mapViewProps = {}
    if (Platform.OS === 'ios') {
      mapViewProps['provider'] = PROVIDER_GOOGLE
    }

    return (
      <View style={this._getStyle()}>
        {this._renderMapLoading()}
        <MapView
          style={[{ flex: 1, width: '100%' }, this.props.style]}
          {...mapViewProps}
          initialRegion={this._getPosition()}
          onLayout={() => {
            this.setState({ isMapReady: true })
          }}
          ref={map => {
            this.map = map
          }}
          region={this.state.region}
        >
          {this._renderMarkers()}
          {this._renderCurrentLocation()}
        </MapView>
      </View>
    )
  }
}

Map.defaultProps = {
  loading: false,
  initialLocationBelongsToVenue: false,
  initialPosition: INITIAL_POSITION,
  style: {}
}

export const styles = StyleSheet.create({
  fullWidth: {
    ...ifIphoneX(
      {
        height: 295
      },
      {
        height: 240
      }
    ),
    width: '100%'
  },
  padded: {
    marginLeft: 20,
    marginRight: 20,
    height: 200
  }
})
