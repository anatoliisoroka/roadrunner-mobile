import RNConfigReader from 'react-native-config-reader'

export default class ConfigHelper {
  static buildName() {
    return RNConfigReader.BuildName
  }

  static getDomain() {
    switch (RNConfigReader.BuildName) {
      case 'customer':
        return ''
      case 'restaurant':
        return ''
      default:
        return ''
    }
  }
}
