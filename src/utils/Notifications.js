import { Alert, Platform, PushNotificationIOS } from 'react-native'
import { Navigation } from 'react-native-navigation'
import PushNotification from 'react-native-push-notification'
import { RNNotificationBanner } from 'react-native-notification-banner'

import Backend from './Backend'
import ConfigHelper from './ConfigHelper'
import AuthManager from './AuthManager'

var isAskingForRequest = false
export default class Notifications {
  static async requestPermission() {
    isAskingForRequest = true
    return PushNotification.requestPermissions().then(
      ({ alert, badge, sound }) => {
        isAskingForRequest = false
        if (alert && badge && sound) {
          return true
        }

        throw { error: 'permissions_not_granted' }
      }
    )
  }

  static hasPermission() {
    return new Promise((resolve, reject) => {
      PushNotification.checkPermissions(({ alert, badge, sound }) => {
        if (alert && badge && sound) {
          resolve(true)
        } else {
          resolve(false)
        }
      })
    })
  }

  static async requestPermissionIfLoggedIn() {
    if (isAskingForRequest) {
      return
    }

    if (!AuthManager.getCurrentUser()) {
      return
    }

    Notifications.requestPermission()
  }

  static handle(notification) {
    for (key in notification) {
      if (key.indexOf('_id') > -1) {
        notification[key] = parseInt(notification[key])
      }
    }

    if (Notifications._shouldShowBanner(notification)) {
      Notifications.show(notification)
    } else {
      Navigation.handleDeepLink({
        link: 'notification/link',
        payload: notification
      })
    }
  }

  static _shouldShowBanner(notification) {
    let isCustomer = ConfigHelper.buildName() === global.Config.Customer
    if (isCustomer) {
      return Notifications._shouldShowBannerForCustomer(notification)
    }

    return Notifications._shouldShowBannerForVenue(notification)
  }

  static _shouldShowBannerForCustomer(notification) {
    if (
      notification.type == 'order' &&
      (global.Screens.CurrentId == global.Screens.OrderDetails ||
        global.Screens.CurrentId == global.Screens.CompleteOrder)
    ) {
      return false
    }
    return true
  }

  static _shouldShowBannerForVenue(notification) {
    if (
      notification.type == 'order' &&
      (global.Screens.CurrentId == global.Screens.VenueOrders ||
        global.Screens.CurrentId == global.Screens.VenueOrderDetails)
    ) {
      return false
    }
    return true
  }

  static show(notification) {
    if (notification.type == 'order') {
      Notifications.showOrder(notification)
    } else if (notification.type == 'admin') {
      Notifications.showAdminMessage(notification)
    }
  }

  static showOrder(notification) {
    Backend.getOrder(notification.order_id)
      .then(order => {
        let isCustomer = ConfigHelper.buildName() === global.Config.Customer
        let screenToShow = isCustomer
          ? global.Screens.OrderDetails
          : global.Screens.VenueOrderDetail

        RNNotificationBanner.Show({
          subTitle: notification.text,
          tintColor: global.Colors.Primary,
          duration: 5,
          onClick: function() {
            Notifications._showScreen(screenToShow, {
              order
            })
          },
          onHide: function() {}
        })
      })
      .catch(error => {
        console.log('Show order error', error)
      })
  }

  static showAdminMessage(notification) {
    RNNotificationBanner.Show({
      subTitle: notification.text,
      tintColor: global.Colors.Primary,
      duration: 5,
      onClick: function() {},
      onHide: function() {}
    })
  }

  static _showScreen(screen, passProps) {
    Navigation.showModal({
      screen,
      passProps
    })
  }
}
