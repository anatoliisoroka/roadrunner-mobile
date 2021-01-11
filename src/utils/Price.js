import { Platform } from 'react-native'
if (Platform.OS === 'android') {
  // only android needs polyfill
  require('intl') // import intl object
  require('intl/locale-data/jsonp/en-IN') // load the required locale details
  require('intl/locale-data/jsonp/en-GB')
  require('intl/locale-data/jsonp/en-US')
  require('intl/locale-data/jsonp/en-IE')
}
export default class Price {
  static format(price, currency) {
    const formatter = new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: currency
    })
    var decimalPrice = 0
    if (price != 0) {
      var decimalPrice = price / 100
    }
    return formatter.format(decimalPrice)
  }
}
