import { ScreenVisibilityListener as RNNScreenVisibilityListener } from 'react-native-navigation'
import DataCollection from './DataCollection'

export class ScreenVisibilityListener {
  constructor() {
    this.listener = new RNNScreenVisibilityListener({
      didAppear: ({ screen, startTime, endTime, commandType }) => {
        global.Screens.CurrentId = screen

        var screenName = screen.replace("roadrunner.", "")
        DataCollection.trackScreenOpened(screenName)
      }
    })
  }

  register() {
    this.listener.register()
  }

  unregister() {
    if (this.listener) {
      this.listener.unregister()
      this.listener = null
    }
  }
}
