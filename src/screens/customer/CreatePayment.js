import React, { Component } from 'react'
import { StyleSheet, Text, Image, View, ScrollView, Alert } from 'react-native'

import LoadingView from '../../components/shared/LoadingView'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { CreditCardInput } from 'rn-credit-card-view'

import screenStyles from '../../assets/css/screens'

import Button from '../../components/shared/Button'

import AuthManager from '../../utils/AuthManager'
import StripeHelper from '../../utils/StripeHelper'
import Backend from '../../utils/Backend'
import TextFormat from '../../utils/TextFormat'
import Notifications from '../../utils/Notifications'
import DripHelper from "../../utils/DripHelper"

type Props = {}
export default class CreatePayment extends Component {
  static navigatorStyle = global.Screens.PrimaryNavBar
  static navigatorButtons = {
    rightButtons: [{ id: 'skip', title: 'Skip' }]
  }
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      name: null,
      number: null,
      cvc: null,
      month: null,
      year: null,
      form: '',
      isValid: false,
      validationText: null
    }

    Notifications.requestPermissionIfLoggedIn()
  }

  componentDidMount() {
    this.props.navigator.setOnNavigatorEvent(this._onNavigatorEvent.bind(this))
    // StripeHelper.setOptions()
  }

  _onNavigatorEvent(event) {
    if (event.id == 'skip') {
      this._dismissModal()
    }
  }

  _dismissModal() {
    this.props.navigator.dismissModal()
    DripHelper.trackBasket()
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
        return AuthManager.refreshCurrentUser()
      })
      .then(() => {
        this._dismissModal()
        this.setState({ isLoading: false })
      })
      .catch(error => {
        console.log('ERROR', error)
        alert(error.message)
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

  render() {
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={[screenStyles.mainContainer, styles.noPadding]}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Add Payment Method</Text>
          <Text style={styles.subTitle}>
            Your payment info is stored securely.
          </Text>
        </View>
        <CreditCardInput
          requiresName
          allowsScroll
          autoFocus
          onChange={form => this._updateCardDetails(form)}
        />
        {this._renderValidationText()}
        <Button
          title="Review Order"
          style={styles.button}
          onPress={() => this._sendCardDetails()}
        />
        <LoadingView isLoading={this.state.isLoading} size="small" />
      </KeyboardAwareScrollView>
    )
  }
}

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: '#F7F7F7',
    borderRadius: 5,
    borderBottomColor: 'transparent',
    height: 50,
    justifyContent: 'center'
  },
  inputText: { marginLeft: 10 },
  logo: { marginTop: 80, marginBottom: 20, height: 200, width: 200 },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '35%'
  },
  title: {
    fontSize: 22,
    fontWeight: '700'
  },
  subTitle: { fontSize: 16, fontWeight: '100', marginTop: 10 },
  button: {
    marginTop: 30,
    marginLeft: 20,
    marginRight: 20
  },
  noPadding: {
    padding: 0
  },
  validationText: {
    color: 'red',
    marginTop: 15,
    marginLeft: 20
  }
})
