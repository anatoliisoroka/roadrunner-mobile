import React, { Component } from 'react'
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native'

import LocationFormat from '../../utils/LocationFormat'
import Text from 'react-native-text'

import textStyles from '../../assets/css/text'

export default class AddressListItem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      location: props.location,
      isModal: props.isModal
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps)
  }

  _getOpacityStyle(location) {
    console.log('location', location)
    if (location.in_delivery_zone == null) {
      return 1.0
    } else {
      if (location.in_delivery_zone) {
        return 1.0
      }
      return 0.3
    }
  }

  _renderDeliveryZoneMessage(location) {
    if (location.in_delivery_zone == null || location.in_delivery_zone) {
      return null
    }
    return (
      <Text style={[textStyles.deliveryZoneText, styles.deliveryText]}>
        This address is not in the delivery area
      </Text>
    )
  }

  render() {
    let { location } = this.state
    return (
      <TouchableOpacity
        disabled={!this.state.isModal || !location.in_delivery_zone}
        onPress={() => this.props.addressSelected(location)}
      >
        <View style={styles.container}>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  textStyles.userAddressText,
                  { marginTop: 5, opacity: this._getOpacityStyle(location) }
                ]}
              >
                {LocationFormat.fullAddress(location)}
              </Text>
            </View>
            <View
              style={{
                opacity: this._getOpacityStyle(location)
              }}
            >
              <TouchableOpacity onPress={this.props.onPress}>
                <Text style={styles.text}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            {this._renderDeliveryZoneMessage(location)}
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 8,
    marginLeft: 10,
    marginRight: 10,
    padding: 5,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#fafafa'
  },
  text: {
    color: global.Colors.Secondary,
    marginTop: 5,
    marginRight: 10
  },
  deliveryText: {
    marginTop: 5,
    textAlign: 'center'
  }
})
