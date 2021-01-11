import React, { Component } from 'react'
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native'

import Modal from 'react-native-modal'

import { CreditCardInput } from 'rn-credit-card-view'
import LinearGradient from 'react-native-linear-gradient'
import TextField from '../../components/shared/TextField'
import Button from '../../components/shared/Button'

import StripeHelper from '../../utils/StripeHelper'
import Backend from '../../utils/Backend'
import TextFormat from '../../utils/TextFormat'
import stripe from 'tipsi-stripe'
import modalStyles from '../../assets/css/modal'

export default class AddCardModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: props.visible,
      title: props.title,
      isLoading: props.isLoading,
      number: '',
      month: '',
      year: '',
      cvc: '',
      name: '',
      form: '',
      isValid: false,
      validationText: null
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps)
  }

  _updateCardDetails(form) {
    let name = form.values.name
    let cardNumber = form.values.number
    let cvc = form.values.cvc
    let month = this._getExpiryMonth(form)
    let year = this._getExpiryYear(form)
    let isValid = form.valid
    this.setState({ name, cardNumber, cvc, month, year, form, isValid })
  }

  close() {
    this.setState({ visible: false }, () => {
      this.props.onModalClosed()
    })
  }

  _setValidationMessage() {
    let { status } = this.state.form
    let validationText = null
    for (var key in status) {
      if (status.hasOwnProperty(key)) {
        if (status[key] == 'incomplete' || status[key] == 'invalid') {
          validationText =
            TextFormat.capitalizeFirst(key) + ' field is ' + status[key]
          break
        }
      }
    }
    this.setState({ validationText })
  }

  _sendCardDetails() {
    if (!this.state.isValid) {
      this._setValidationMessage()
      return
    }
    let { name, cardNumber, month, year, cvc } = this.state
    this.setState({ isLoading: true, validationText: null })
    StripeHelper.createCard(name, cardNumber, month, year, cvc)
      .then(token => {
        return Backend.saveCard(token)
      })
      .then(card => {
        this.setState({ isLoading: false }, () => {
          this.close()
          this.props.newCardAdded(card)
        })
      })
      .catch(error => {
        console.log('ERROR', error)
        alert(error.error)
        this.setState({ isLoading: false })
      })
  }

  _getExpiryMonth(form) {
    let date = form.values.expiry
    let month = date.substring(0, 2)
    return month
  }

  _getExpiryYear(form) {
    let date = form.values.expiry
    let year = date.substring(date.indexOf('/') + 1)
    return year
  }

  _renderValidationText() {
    if (this.state.validationText == null) {
      return null
    }
    return (
      <Text style={styles.validationText}>{this.state.validationText}</Text>
    )
  }

  renderModal() {
    return (
      <View>
        <Text style={modalStyles.title}>Add New Card</Text>
        <CreditCardInput
          requiresName
          autoFocus
          allowScroll
          onChange={form => this._updateCardDetails(form)}
        />
        {this._renderValidationText()}
        <Button
          title="Save"
          style={styles.button}
          isLoading={this.state.isLoading}
          onPress={() => this._sendCardDetails()}
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
  container: { backgroundColor: 'white' },
  inputContainer: {
    marginBottom: 30
  },
  expiration: {
    flexDirection: 'row',
    backgroundColor: 'pink'
  },
  button: {
    marginTop: 20
  },
  validationText: {
    color: 'red',
    marginTop: 15
  }
})

AddCardModal.defaultProps = {
  visible: false,
  title: 'Modal Title'
}
