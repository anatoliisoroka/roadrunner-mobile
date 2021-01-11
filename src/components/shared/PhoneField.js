import React from 'react'
import { Text, View, TextInput, StyleSheet } from 'react-native'

import CountryPicker, {
  getAllCountries
} from 'react-native-country-picker-modal'

DIAL_CODES = null

export default class PhoneField extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      initialValue: null,
      isValidPhoneNumber: false,
      countryCode: props.countryCode,
      dialCode: props.dialCode ? props.dialCode.replace('+', '') : null,
      showDialCode: props.showDialCode
    }
  }

  componentDidMount() {
    if (this.props.value) {
      this.setCountryCodeAndNumber(this.props.value)
    }
  }

  async setCountryCodeAndNumber(value) {
    if (!DIAL_CODES) {
      DIAL_CODES = await this._getDialCodes()
    }

    let dialCode = this._getDialCode(value)
    let searchCode = dialCode
    if (searchCode) {
      searchCode = searchCode.replace('+', '')
    }

    let countryData = DIAL_CODES[searchCode]

    let countryCode = countryData ? countryData.countryCode : null

    let number = value.replace(dialCode, '')

    this.setState({ countryCode, number, dialCode: searchCode })
  }

  async _getDialCodes() {
    let countryCodes = {}

    let countries = await getAllCountries()

    countries.forEach(country => {
      country.callingCode.forEach(code => {
        countryCodes[code] = {
          code,
          countryCode: country.cca2
        }
      })
    })

    return countryCodes
  }

  _getDialCode(number) {
    let dialCode = ''
    // only interested in international numbers (starting with a plus)
    if (number.charAt(0) === '+') {
      let numericChars = ''
      // iterate over chars
      for (let i = 0; i < number.length; i++) {
        const c = number.charAt(i)
        // if char is number
        if (this._isNumeric(c)) {
          numericChars += c
          // if current numericChars make a valid dial code
          // if (this.countryCodes[numericChars]) {
          if (DIAL_CODES[numericChars]) {
            // store the actual raw string (useful for matching later)
            dialCode = number.substr(0, i + 1)
          }
          // longest dial code is 4 chars
          if (numericChars.length === 4) {
            break
          }
        }
      }
    }
    return dialCode
  }

  _dialCode() {
    return '+' + this.state.dialCode
  }

  _isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n)
  }

  render() {
    const { number, countryCode, showDialCode, dialCode, visible } = this.state

    return (
      <View style={[styles.container, this.props.container]}>
        <View style={[styles.flagContainer, this.props.flatContainer]}>
          <CountryPicker
            countryCode={countryCode}
            withCallingCode
            withCloseButton
            withAlphaFilter
            withFilter
            onSelect={country => {
              this.setState(
                {
                  countryCode: country.cca2,
                  dialCode: country.callingCode[0],
                  ivisible: false
                },
                () => {
                  this.props.onChangePhoneNumber(this._dialCode(), number)
                }
              )
            }}
            onClose={() => this.setState({ visible: false })}
            onOpen={() => this.setState({ visible: true })}
            visible={visible}
          />
          {showDialCode && (
            <Text
              style={[styles.dialCode, this.props.dialCodeStyle]}
              onPress={() => {
                this.setState({ visible: true })
              }}
            >
              {this._dialCode()}
            </Text>
          )}
        </View>
        <TextInput
          {...this.props.textProps}
          style={[styles.input, this.props.inputStyle]}
          keyboardType={'phone-pad'}
          value={number}
          onChangeText={number => {
            this.setState({ number }, () => {
              this.props.onChangePhoneNumber(this._dialCode(), number)
            })
          }}
        />
      </View>
    )
  }
}

PhoneField.defaultProps = {
  countryCode: 'GB',
  dialCode: '+44',
  showDialCode: true,
  dialCodeStyle: {},
  inputStyle: {},
  flagSize: 30,
  textProps: {}
}

const styles = {
  container: {
    flexDirection: 'row',
    marginBottom: -6
  },
  flagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 5
  },
  dialCode: {
    marginLeft: -8,
    marginRight: 4
  },
  input: {
    flexGrow: 1,
    height: '100%',
    fontSize: 18,
    margin: 0,
    padding: 0
  }
}
