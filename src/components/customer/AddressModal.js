import React, { Component } from 'react'
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  ScrollView
} from 'react-native'

import Modal from 'react-native-modal'

import LocationSearch from '../../components/shared/LocationSearch'
import Button from '../../components/shared/Button'
import Backend from '../../utils/Backend'

import modalStyles from '../../assets/css/modal'

export default class AddressModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: props.visible,
      title: props.title,
      isLoading: props.isLoading,
      location: null
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps)
  }

  close() {
    this.setState({ visible: false })
    this.props.onModalClosed()
  }

  _addNewAddress() {
    let { location } = this.state
    this.setState({ isLoading: true })
    Backend.saveAddress(location)
      .then(response => {
        console.log('RES', response)
        this.props.onAddressAdded()
        this.setState({ isLoading: false, visible: false })
      })
      .catch(error => {
        console.warn(error.message)
        this.setState({ isLoading: false })
      })
  }

  renderModal() {
    return (
      <ScrollView>
        <Text style={modalStyles.title}>Add New Address</Text>
        <LocationSearch
          ref={locationField => (this.locationField = locationField)}
          onPlaceSelected={location => {
            locationData = {
              address_line_1: location.address,
              city: location.city,
              country: location.country,
              state: location.state,
              country_short: location.countryShort,
              longitude: location.longitude,
              latitude: location.latitude
            }
            this.props.onAddressSelected(locationData)
            this.setState({ location: locationData })
          }}
        />
        <Button
          title="Save"
          style={styles.button}
          isLoading={this.state.isLoading}
          onPress={() => this._addNewAddress()}
        />
      </ScrollView>
    )
  }

  render() {
    return (
      <Modal
        isVisible={this.state.visible}
        onBackdropPress={() => this.close()}
      >
        <View style={modalStyles.container}>{this.renderModal()}</View>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: 'white' },
  inputContainer: {
    marginBottom: 30
  },
  expiration: {
    flexDirection: 'row',
    backgroundColor: 'pink'
  },
  button: {
    marginTop: 10
  }
})

AddressModal.defaultProps = {
  visible: false,
  title: 'Modal Title'
}
