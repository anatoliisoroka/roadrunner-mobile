import { Navigation } from 'react-native-navigation'

export default class Broadcast {
  static sendSelectedDate(selectedDate) {
    Broadcast._sendBroadcast(global.Broadcast.SelectedDateUpdated, selectedDate)
  }

  static _sendBroadcast(link, payload) {
    Navigation.handleDeepLink({
      link,
      payload
    })
  }
}
