import { Navigation } from 'react-native-navigation'
import { Alert, Platform } from 'react-native'

import ConfigHelper from '../utils/ConfigHelper'
import PushNotificationIOS from '@react-native-community/push-notification-ios'
import PushNotification from 'react-native-push-notification'
import { ScreenVisibilityListener } from '../utils/ScreenVisibilityListener'

import Splash from './shared/Splash'
import Onboarding from './shared/Onboarding'
import Landing from './shared/Landing'
import Login from './shared/Login'
import Web from './shared/Web'
import ForgotPassword from './shared/ForgotPassword'
import ResetPassword from './shared/ResetPassword'

import About from './customer/About'
import Addresses from './customer/Addresses'
import Dietaries from './customer/Dietaries'
import Basket from './customer/Basket'
import CompleteOrder from './customer/CompleteOrder'
import CreateAccount from './customer/CreateAccount'
import CreatePayment from './customer/CreatePayment'
import Feed from './customer/Feed'
import Feedback from './customer/Feedback'
import Filter from './customer/Filter'
import LocationEntry from './customer/LocationEntry'
import LocationPermission from './customer/LocationPermission'
import Menu from './customer/Menu'
import MoreInfo from './customer/MoreInfo'
import OrderDetails from './customer/OrderDetails'
import OrderPayment from './customer/OrderPayment'
import Orders from './customer/Orders'

import Payment from './customer/Payment'
import Profile from './customer/Profile'
import ProfileDetails from './customer/ProfileDetails'
import SignUp from './customer/SignUp'
import SubMenu from './customer/SubMenu'
import Venues from './customer/Venues'

import ManagePasswords from './venue/ManagePasswords'
import VenueOrderDetails from './venue/VenueOrderDetails'
import VenueOrders from './venue/VenueOrders'
import Settings from './venue/Settings'
import TotalIncome from './venue/TotalIncome'
import PhoneVerification from "./customer/PhoneVerification"

import Backend from '../utils/Backend'
import Notifications from '../utils/Notifications'
// Custom Views
import OrderScheduleNavBarButton from '../components/customer/OrderScheduleNavBarButton'

import styles from '../assets/css/main'
import screenStyles from '../assets/css/screens'

export function registerScreens() {
  Navigation.registerComponent(global.Screens.Splash, () => Splash)
  Navigation.registerComponent(global.Screens.Onboarding, () => Onboarding)
  Navigation.registerComponent(global.Screens.Landing, () => Landing)
  Navigation.registerComponent(global.Screens.Login, () => Login)
  Navigation.registerComponent(global.Screens.Web, () => Web)
  Navigation.registerComponent(
    global.Screens.ForgotPassword,
    () => ForgotPassword
  )
  Navigation.registerComponent(
    global.Screens.ResetPassword,
    () => ResetPassword
  )

  // Customer
  Navigation.registerComponent(global.Screens.About, () => About)
  Navigation.registerComponent(global.Screens.Addresses, () => Addresses)
  Navigation.registerComponent(global.Screens.Dietaries, () => Dietaries)
  Navigation.registerComponent(global.Screens.Basket, () => Basket)
  Navigation.registerComponent(
    global.Screens.CompleteOrder,
    () => CompleteOrder
  )
  Navigation.registerComponent(
    global.Screens.CreateAccount,
    () => CreateAccount
  )

  Navigation.registerComponent(
    global.Screens.CreatePayment,
    () => CreatePayment
  )
  Navigation.registerComponent(global.Screens.Feed, () => Feed)
  Navigation.registerComponent(global.Screens.Feedback, () => Feedback)
  Navigation.registerComponent(global.Screens.Filter, () => Filter)
  Navigation.registerComponent(
    global.Screens.LocationEntry,
    () => LocationEntry
  )
  Navigation.registerComponent(
    global.Screens.LocationPermission,
    () => LocationPermission
  )
  Navigation.registerComponent(global.Screens.Menu, () => Menu)
  Navigation.registerComponent(global.Screens.MoreInfo, () => MoreInfo)
  Navigation.registerComponent(global.Screens.OrderDetails, () => OrderDetails)
  Navigation.registerComponent(global.Screens.OrderPayment, () => OrderPayment)
  Navigation.registerComponent(global.Screens.Orders, () => Orders)
  Navigation.registerComponent(global.Screens.Payment, () => Payment)
  Navigation.registerComponent(
    global.Screens.ProfileDetails,
    () => ProfileDetails
  )
  Navigation.registerComponent(global.Screens.Profile, () => Profile)
  Navigation.registerComponent(global.Screens.SignUp, () => SignUp)
  Navigation.registerComponent(global.Screens.SubMenu, () => SubMenu)

  Navigation.registerComponent(global.Screens.Venues, () => Venues)

  // Venue
  Navigation.registerComponent(
    global.Screens.ManagePasswords,
    () => ManagePasswords
  )
  Navigation.registerComponent(
    global.Screens.VenueOrderDetails,
    () => VenueOrderDetails
  )
  Navigation.registerComponent(global.Screens.VenueOrders, () => VenueOrders)
  Navigation.registerComponent(global.Screens.Settings, () => Settings)
  Navigation.registerComponent(global.Screens.TotalIncome, () => TotalIncome)

    Navigation.registerComponent(global.Screens.PhoneVerification, () => PhoneVerification)

  // Custom Views
  Navigation.registerComponent(
    global.Screens.OrderScheduleNavBarButton,
    () => OrderScheduleNavBarButton
  )
}

export function startApp() {
  new ScreenVisibilityListener().register()
  Navigation.startSingleScreenApp({
    screen: {
      screen: global.Screens.Splash,
      navigatorStyle: global.Screens.NoNavBar
    },
    appStyle:
      ConfigHelper.buildName() === global.Config.Customer
        ? global.Screens.NoNavBar
        : global.Screens.NoNavBarAuto
  })
}

export function startAppWith(screen, navBarStyle = global.Screens.NoNavBar) {
  Navigation.startSingleScreenApp({
    screen: {
      screen: screen,
      navigatorStyle: navBarStyle
    },
    appStyle: navBarStyle
  })
}

PushNotification.configure({
  // (optional) Called when Token is generated (iOS and Android)
  onRegister: function(token) {
    console.log('REGISTER', token)
    global.Api.DeviceToken = token.token
    setTimeout(() => {
      Backend.sendToken(token.token)
    }, 1000)
  },

  // (required) Called when a remote or local notification is opened or received
  onNotification: function(notification) {
    console.log('NOTIFICATION RECEIVED', notification)
    data = Platform.OS == 'ios' ? notification.data : notification
    Notifications.handle(data)
    // required on iOS only (see fetchCompletionHandler docs: https://facebook.github.io/react-native/docs/pushnotificationios.html)
    notification.finish(PushNotificationIOS.FetchResult.NoData)
  },

  senderID: global.Api.Key.FCM_SENDER_ID,

  requestPermissions: false,
  popInitialNotification: false
})

const iconInset =
  Platform.OS == 'ios'
    ? {
        top: 6,
        left: 0,
        bottom: -6,
        right: 0
      }
    : {}

const appStyle = {
  navBarButtonColor: global.Colors.NavBarButtonColor,
  disabledBackGesture: true,
  tabBarSelectedButtonColor: global.Colors.Primary,
  tabBarShowLabels: 'hidden',
  tabBarHideShadow: true,
  topBarElevationShadowEnabled: false,
  navBarTitleTextCentered: true, // Android Only
  hideBackButtonTitle: true
}

const tabsStyle = {
  tabBarSelectedButtonColor: global.Colors.Primary,
  tabBarShowLabels: 'hidden',
  tabBarHideShadow: true,
  navBarTitleTextCentered: true // Android Only
}
