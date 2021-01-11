import React, { Component } from 'react'
import {
  StyleSheet,
  Platform,
  View,
  Text,
  Image,
  TextInput
} from 'react-native'

import Button from '../../components/shared/Button'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Scroller from '../../components/shared/Scroller'
import TextField from '../../components/shared/TextField'
import LoadingView from '../../components/shared/LoadingView'

import AuthManager from '../../utils/AuthManager'
import Backend from '../../utils/Backend'

const PAGE_PHONE_NUMBER_FORM = {
  mode: 'MODE_PHONE_NUMBER_FORM',
  message:
    'Please verify your phone number to ensure we can reach you if needed with regards to any orders you may place. You can change this in Settings at any time'
}

const PAGE_VERIFICATION_CODE_FORM = {
  mode: 'MODE_VERIFICATION_CODE_FORM',
  message: 'We\'ve sent a verification code to your phone '
}
const PAGES = [PAGE_PHONE_NUMBER_FORM, PAGE_VERIFICATION_CODE_FORM]

const IMAGE_PHONE_VERIFICATION = require('../../assets/images/phone_verification.png')

import screenStyles from '../../assets/css/screens'
export default class PhoneVerification extends Component {
  static navigatorStyle = global.Screens.NoNavBar

  constructor(props) {
    super(props)
    let customer = AuthManager.getCurrentUser()
    let user = customer.user
    let data = {}

    if (user.phone_country_code && user.phone_number) {
      data.phone_country_code = user.phone_country_code
      data.phone_number = user.phone_number
    }
    this.state = {
      customer,
      data,
      isLoading: false,
      page: PAGE_PHONE_NUMBER_FORM
    }
  }

  _updateData(key, value) {
    let { data } = this.state

    data[key] = value
    if (key == 'phone_country_code' || key == 'phone_number') {
      this._updateUser(key, value)
    }

    this.setState({ data })
  }

  _updateUser(key, value) {
    let customer = { ...this.state.customer }
    let user = customer.user
    user[key] = value
    customer.user = user
    this.setState({ customer })
  }

  _isFormValid() {
    let isFormValid = true

    if (this._isPhoneNumberFormCurrentPage()) {
      if (!this.tfPhone.isValid()) {
        alert('Please enter your phone number')
        isFormValid = false
      }
    }

    if (!this._isPhoneNumberFormCurrentPage()) {
      if (!this.tfCode.isValid()) {
        alert('Please enter your code')
        isFormValid = false
      }
    }
    return isFormValid
  }

  _isPhoneNumberFormCurrentPage() {
    let { page } = this.state
    return page === PAGE_PHONE_NUMBER_FORM
  }

  _onNextButtonPressed() {
    if (this._isPhoneNumberFormCurrentPage()) {
      return this._handleRequestPhoneVerification()
    }

    return this._handlePhoneVerification()
  }

  _handleRequestPhoneVerification() {
    if (!this._isFormValid()) {
      alert('Please enter a phone number')
      return
    }
    let { isLoading, customer } = this.state

    if (isLoading) {
      return
    }
    this.setState({ isLoading: true })
    Backend.updateCustomer(customer)
      .then(customer => {
        AuthManager.currentUser = customer
        return Backend.requestPhoneVerification()
      })
      .then(() => {
        alert('Verification code is sent!')
        this.setState({ isLoading: false })
        this.pageScroller.next()
      })
      .catch(error => {
        console.warn(error)
        this.setState({ isLoading: false })
        alert(error.message)
      })
  }

  _handlePhoneVerification() {
    if (!this._isFormValid()) {
      alert('Please enter a verification code')
      return
    }
    let { isLoading } = this.state
    if (isLoading) {
      return
    }
    this.setState({ isLoading: true })
    let { code } = this.state.data
    Backend.verifyPhone(code)
      .then(response => {
        this.setState({ isLoading: false })
        this.props.onPhoneVerified()
      })
      .catch(error => {
        console.warn(error)
        this.setState({ isLoading: false })
        alert(error.message)
      })
  }

  _onBackButtonPressed() {
    this.pageScroller.previous()
  }

  _renderPage() {
    let { page, data } = this.state
    switch (page) {
      case PAGE_PHONE_NUMBER_FORM:
        return (
          <TextField
            ref={tfPhone => (this.tfPhone = tfPhone)}
            value={data.phone_country_code + data.phone_number}
            type="phone"
            placeholder="Phone"
            containerStyle={{ marginBottom: 20, marginTop: 10 }}
            onChangePhoneNumber={(phoneCountryCode, phoneNumber) => {
              this._updateData('phone_country_code', phoneCountryCode)
              this._updateData('phone_number', phoneNumber)
            }}
          />
        )
      case PAGE_VERIFICATION_CODE_FORM:
        return (
          <View>
          <TextField
            ref={tfCode => (this.tfCode = tfCode)}
            value={data.code}
            type={'text'}
            placeholder="Verification Code"
            containerStyle={{ marginBottom: 20, marginTop: 40 }}
            onChangeText={code => {
              this._updateData('code', code)
            }}
          />
          </View>
        )
      default:
        return null
    }
  }

  _renderButtons() {
    let { page } = this.state
    let buttonNext = (
      <Button
        type="tertiary"
        title="Next"
        style={styles.button}
        onPress={() => this._onNextButtonPressed()}
      />
    )

    if (this._isPhoneNumberFormCurrentPage()) {
      return buttonNext
    }

    return (
      <>
        {buttonNext}
        <Button
          type="quaternary"
          title="Change Number"
          onPress={() => this._onBackButtonPressed()}
        />
      </>
    )
  }

  _renderText() {
    let { page, data } = this.state
    let message = page.message
    if (!this._isPhoneNumberFormCurrentPage()){
      message += `'${data.phone_country_code + data.phone_number}'. Please enter it below to verify your phone. `
    }
    return <Text style={styles.messageText}>{message}</Text>
  }

  render() {
    let { isLoading } = this.state
    return (
      <KeyboardAwareScrollView contentContainerStyle={styles.container}>
        <Image
          source={IMAGE_PHONE_VERIFICATION}
          style={{
            marginTop: 40,
            aspectRatio: 1.8,
            height: 180,
            resizeMode: 'cover'
          }}
        />
        {this._renderText()}

        <Scroller
          ref={pageScroller => (this.pageScroller = pageScroller)}
          totalPagesNo={PAGES.length}
          contentContainerStyle={{
            backgroundColor: 'transparent'
          }}
          onPageChanged={currentPageIndex => {
            let page = PAGES[currentPageIndex]
            this.setState({ page })
          }}
          renderPage={index => this._renderPage()}
        />

        <View style={styles.buttonsContainer}>{this._renderButtons()}</View>
        <LoadingView isLoading={this.state.isLoading} size="small" />
      </KeyboardAwareScrollView>
    )
  }
}

PhoneVerification.defaultProps = {
  onSuccess: () => {}
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: global.Colors.ScreenBackground,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  messageText: {
    fontWeight: '500',
    fontSize: 14,
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'center'
  },
  buttonsContainer: {
    width: '100%',
    justifyContent: 'flex-end'
  },
  button: {
    marginBottom: 20
  }
})
