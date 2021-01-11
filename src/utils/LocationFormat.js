export default class LocationFormat {
  static fullAddress(location) {
    let fullAddress = location.address_line_1
    let address2 = ''
    let address3 = ''
    let cityState = ''
    let postalCode = ''
    if (location.address_line_2 || location.address_line_2 != null) {
      fullAddress += '\n' + location.address_line_2 + ',\n'
    }
    if (location.address_line_3 || location.address_line_3 != null) {
      afullAddress += location.address_line_3 + ',\n'
    }
    if (location.city === location.state) {
      cityState = location.city
    } else {
      cityState = location.city + ',\n' + location.state
    }
    fullAddress += '\n' + cityState

    if (location.postal_code || location.postal_code != null) {
      fullAddress += '\n' + location.postal_code
    }

    return fullAddress
  }
}
