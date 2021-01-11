import React, { Component } from 'react'
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native'

import LocationSearch from './LocationSearch'
import Modal from 'react-native-modal'
import Button from '../shared/Button'
import TextField from './TextField'
import AuthManager from '../../utils/AuthManager'
import modalStyles from '../../assets/css/modal'

export default class LocationModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: props.visible,
      isLoading: props.isLoading,
      validationText: props.validationText,
      showValidationText: false,
      doneDisabled: props.doneDisabled
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps)
  }

  close() {
    this.setState({ visible: false })
    this.props.onModalClosed()
  }

  _renderValidationText() {
    if (!this.state.showValidationText) {
      return null
    }
    return (
      <Text style={styles.validationText}>{this.state.validationText}</Text>
    )
  }

  renderModal() {
    return (
      <View>
        <Text style={modalStyles.title}>Enter Address</Text>
        <View style={{ flexGrow: 1 }}>
          <LocationSearch
          containerHeight={{height: 200}}
            ref={locationField => (this.locationField = locationField)}
            onPlaceSelected={location => {
              let locationData = {
                address_line_1: location.address,
                city: location.city,
                country: location.country,
                state: location.state,
                country_short: location.countryShort,
                longitude: location.longitude,
                latitude: location.latitude
              }
              this.props.onLocationUpdated(locationData)
            }}
          />
        </View>
        {this._renderValidationText()}
        <Button
          title="Done"
          isDisabled={this.state.doneDisabled}
          style={styles.button}
          isLoading={this.state.isLoading}
          onPress={() => this.props.onDonePressed()}
        />
      </View>
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
  inputContainer: {
    marginBottom: 30
  },
  button: {
    marginTop: 20
  },
  container: {
    borderWidth: 0,
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderColor: '#e2e2e2',
    marginLeft: 10,
    marginRight: 10
  },
  text: {
    textAlign: 'left',
    width: '95%',
    paddingLeft: 10,
    fontSize: 16,
    fontWeight: '500'
  },
  validationText: {
    color: 'red'
  }
})

LocationModal.defaultProps = {
  visible: false
}
