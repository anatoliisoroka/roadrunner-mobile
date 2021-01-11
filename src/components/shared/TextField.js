import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Animated,
  Easing,
  ScrollView,
  Text,
  Dimensions
} from 'react-native'

import PropTypes from 'prop-types'

import PhoneField from './PhoneField'
import { FormInput, FormValidationMessage } from 'react-native-elements'

type Props = {}

export default class TextField extends Component<Props> {
  constructor(props) {
    super(props)

    autoCapitalize = props.autoCapitalize
    if (props.type == 'email' || props.type == 'password') {
      autoCapitalize = 'none'
    }

    this.state = {
      placeholder: props.placeholder,
      type: props.type,
      containerStyle: props.containerStyle,
      viewContainerStyle: props.viewContainerStyle,
      textStyle: props.textStyle,
      maxLength: props.maxLength,
      multiline: props.multiline,
      autoCapitalize: autoCapitalize,
      value: props.value ? props.value.toString() : null,
      _hasFocus: false,
      error: null,
      isDisabled: props.isDisabled
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.type == "phone"){
      this.setState({
        value: nextProps.value ? nextProps.value.toString() : nextProps.value
      })
    }
    // this.setState({
    //   ...nextProps,
    //   value: nextProps.value ? nextProps.value.toString() : nextProps.value,
    // })
  }

  isValid() {
    this.state.error = ''
    if (this.props.validate == false) {
      return true
    }

    if (this.state.value == null || this.state.value == '') {
      this.setState({ error: 'Please enter something' })
      return false
    }

    if (this.state.type == 'email') {
      let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
      if (reg.test(this.state.value) == false) {
        this.setState({ error: 'Please enter a valid email address' })
        return false
      }
    } else if (this.state.type == 'password') {
      // if (this.state.value.length < 8) {
      //   this.setState({ error: 'Password must have 8 or more characters' })
      //   return false
      // }
      // var reg = /[0-9]+/
      // if(!reg.test(this.state.value)){
      //   this.setState({error: "Password must contain at least one number"})
      //   return false;
      // }
      //
      // reg = /[A-Z]+/
      // if(!reg.test(this.state.value)){
      //     this.setState({error: "Password must contain at least one uppercase character"})
      //     return false;
      // }
      //
      // reg = /[a-z]+/
      // if(!reg.test(this.state.value)){
      //   this.setState({error: "Password must contain at least one lowercase character"})
      //   return false;
      // }
      //
      // reg = /[^a-zA-Z0-9]+/
      // if(!reg.test(this.state.value)){
      //   this.setState({error: "Password must contain at least one special character"})
      //   return false;
      // }
    }
    return true
  }

  _isValidPhoneNumber() {
    isValid = true
    if (this.phone.getISOCode() == null) {
      this.setState({ error: 'Please select a valid country code' })
      isValid = false
    } else if (!this.phone.isValidNumber()) {
      this.setState({ error: 'Please enter a valid phone number' })
      isValid = false

    }
    return isValid
  }

  _getKeyboardType() {
    switch (this.state.type) {
      case 'text':
        return 'default'
      case 'email':
        return 'email-address'
      case 'phone':
        return 'phone-pad'
      case 'number':
        return 'numeric'
      default:
        return 'default'
    }
  }

  _isSecureTextEntry() {
    return this.state.type == 'password'
  }

  _onBlur() {
    this.setState({ _hasFocus: false })
  }

  _onFocus() {
    this.setState({ _hasFocus: true, error: null })
  }

  _underlineColor() {
    return this.state._hasFocus ? global.Colors.Primary : 'lightgray'
  }

  _handleOnChangePhoneNumber() {
    if (this.phone.getISOCode() == null) {
      this.props.onChangePhoneNumber('', '')
      return
    }

    countryCode = this.phone.getISOCode()
      ? '+' + this.phone.getCountryCode()
      : ''
    phoneNumber = this.phone.getValue().replace(countryCode, '')

    this.props.onChangePhoneNumber(countryCode, phoneNumber)
  }

  _showFloatingLabel() {
    return (
      this.props.showFloatingLabel &&
      this.state.value != null &&
      this.state.value != ''
    )
  }

  _renderFloatingLabel(text) {
    if (!this._showFloatingLabel()) {
      return null
    }

    return (
      <Text
        style={[
          { color: '#888', marginTop: 20 },
          this.props.floatingLabelStyle
        ]}
      >
        {text}
      </Text>
    )
  }

  _renderErrorMessage() {
    if (this.state.error == null || this.state.error == '') {
      return null
    }

    return (
      <FormValidationMessage labelStyle={{ marginLeft: 0 }}>
        {this.state.error}
      </FormValidationMessage>
    )
  }

  _renderInput() {
    if (this.state.type == 'phone') {
      return this._renderPhoneInput()
    }

    return (
      <View>
        {this._renderFloatingLabel(this.state.placeholder)}
        <FormInput
          placeholder={this.state.placeholder}
          value={this.state.value}
          onChangeText={value => {
            this.setState({ value: value.toString() })
            this.props.onChangeText(value)
          }}
          containerStyle={[
            {
              width: '100%',
              marginLeft: 0,
              marginRight: 0,
              marginTop: this._showFloatingLabel() ? 0 : 38,
              borderBottomColor: this._underlineColor()
            },
            this.state.containerStyle
          ]}
          inputStyle={[
            { width: '100%', color: 'black', fontSize: 18, fontWeight: '400' },
            [this.state.textStyle]
          ]}
          underlineColorAndroid={this._underlineColor()}
          onBlur={() => this._onBlur()}
          onFocus={() => this._onFocus()}
          keyboardType={this._getKeyboardType()}
          secureTextEntry={this._isSecureTextEntry()}
          maxLength={this.state.maxLength}
          multiline={this.state.multiline}
          autoCapitalize={this.state.autoCapitalize}
          editable={!this.state.isDisabled}
        />
      </View>
    )
  }

  _renderPhoneInput() {
    let textStyle = { color: 'black', fontSize: 18, fontWeight: '400' }

    return (
      <View
        style={[
          { width: '100%', marginTop: this._showFloatingLabel() ? 0 : 38 },
          this.props.containerStyle
        ]}
      >
        {this._renderFloatingLabel(this.state.placeholder)}
        <PhoneField
          ref={phone => (this.phone = phone)}
          value={this.state.value}
          initialCountry="GB"
          onChangePhoneNumber={(countryCode, number) => {
            let value = countryCode + number
            this.setState({ value }, () => {
                this.props.onChangePhoneNumber(countryCode, number)
            })

          }}
          textProps={{
            onBlur: () => this._onBlur(),
            onFocus: () => this._onFocus(),
            placeholder: this.props.placeholder
          }}
          inputStyle={textStyle}
          dialCodeStyle={{
            ...textStyle,
            color: global.Colors.DarkGray
          }}
        />
        {this.props.hr && (
          <View
            style={{
              width: '100%',
              marginTop: 8,
              height: 1,
              backgroundColor: this._underlineColor()
            }}
          />
        )}
      </View>
    )
  }

  render() {
    return (
      <View style={[{ width: '100%' }, this.state.viewContainerStyle]}>
        {this._renderInput()}
        {this._renderErrorMessage()}
      </View>
    )
  }
}

TextField.propTypes = {
  placeholder: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['text', 'email', 'password', 'phone', 'number']),
  onChangeText: PropTypes.func.isRequired,
  onChangePhoneNumber: PropTypes.func.isRequired
}

TextField.defaultProps = {
  placeholder: '',
  type: 'text',
  containerStyle: {},
  viewContainerStyle: {},
  textStyle: {},
  onChangeText: () => {},
  onChangePhoneNumber: () => {},
  maxLength: 999999,
  multiline: false,
  autoCapitalize: 'sentences',
  showFloatingLabel: false,
  hr: true
}
