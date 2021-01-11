import { Linking } from 'react-native'

export default class CallHelper {
  static call(phoneNumber) {
    let url = `tel:${phoneNumber}`
    return Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          Linking.openURL(url)
          return { success: true }
        } else {
          let error = { message: "Can't call this number: " + phoneNumber }
          throw error
        }
      })
      .catch(error => {
        throw error
      })
  }
}
