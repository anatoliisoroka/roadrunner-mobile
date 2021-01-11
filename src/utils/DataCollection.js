import analytics from '@react-native-firebase/analytics';

export default class DataCollection {

  static setUser(user){
    analytics().setUserId(`${user.id}`)
    analytics().setUserProperties({
      user_id: `${user.id}`,
      email: user.email,
      name: user.first_name + ' ' + user.last_name
     });
  }

  static trackScreenOpened(screen){
    analytics().setCurrentScreen(screen, screen)
    DataCollection.track("Screen_"+screen)
  }

  static track(label, params={}){
    if(global.Api.IsDebug){
      console.log("Data collection will be disabled for non production")
      return
    }

    try{
      analytics().logEvent(label, params)
      console.log("Collected data:", label, params)
    }
    catch(error){
      console.log("Error collecting data:", error)
    }
  }

}
