import { Platform } from 'react-native'
global.Screens = {}

global.Screens.Base = 'roadrunner.'

// Shared
global.Screens.Splash = global.Screens.Base + 'Splash'
global.Screens.Onboarding = global.Screens.Base + 'Onboarding'
global.Screens.Landing = global.Screens.Base + 'Landing'
global.Screens.Login = global.Screens.Base + 'Login'
global.Screens.Web = global.Screens.Base + 'Web'
global.Screens.ResetPassword = global.Screens.Base + 'ResetPassword'
global.Screens.ForgotPassword = global.Screens.Base + 'ForgotPassword'

// Venue
global.Screens.ManagePasswords = global.Screens.Base + 'ManagePasswords'
global.Screens.VenueOrderDetails = global.Screens.Base + 'VenueOrderDetails'
global.Screens.VenueOrders = global.Screens.Base + 'VenueOrders'
global.Screens.Settings = global.Screens.Base + 'Settings'
global.Screens.TotalIncome = global.Screens.Base + 'TotalIncome'

// Customer
global.Screens.About = global.Screens.Base + 'About'
global.Screens.Addresses = global.Screens.Base + 'Addresses'
global.Screens.Dietaries = global.Screens.Base + 'Dietaries'
global.Screens.Basket = global.Screens.Base + 'Basket'
global.Screens.CompleteOrder = global.Screens.Base + 'CompleteOrder'
global.Screens.CreateAccount = global.Screens.Base + 'CreateAccount'
global.Screens.CreatePayment = global.Screens.Base + 'CreatePayment'
global.Screens.Feed = global.Screens.Base + 'Feed'
global.Screens.Feedback = global.Screens.Base + 'Feedback'
global.Screens.Filter = global.Screens.Base + 'Filter'
global.Screens.LocationEntry = global.Screens.Base + 'LocationEntry'
global.Screens.LocationPermission = global.Screens.Base + 'LocationPermission'
global.Screens.Menu = global.Screens.Base + 'Menu'
global.Screens.Orders = global.Screens.Base + 'Orders'
global.Screens.OrderPayment = global.Screens.Base + 'OrderPayment'
global.Screens.Payment = global.Screens.Base + 'Payment'
global.Screens.Profile = global.Screens.Base + 'Profile'
global.Screens.ProfileDetails = global.Screens.Base + 'ProfileDetails'
global.Screens.SignUp = global.Screens.Base + 'SignUp'
global.Screens.SubMenu = global.Screens.Base + 'SubMenu'
global.Screens.Venues = global.Screens.Base + 'Venues'
global.Screens.OrderDetails = global.Screens.Base + 'OrderDetails'
global.Screens.MoreInfo = global.Screens.Base + 'MoreInfo'
global.Screens.PhoneVerification = global.Screens.Base + 'PhoneVerification'

//  CustomView
global.Screens.OrderScheduleNavBarButton =
  global.Screens.Base + 'OrderScheduleNavBarButton'

global.Screens.PrimaryNavBar = {
  navBarBackgroundColor: '#f7f7f7',
  statusBarColor: global.Colors.Primary,
  navBarButtonColor: global.Colors.Primary,
  navBarTextColor: global.Colors.Primary,
  statusBarTextColorScheme: Platform.OS === 'ios' ? 'dark' : 'light',
  navBarHidden: false
}

global.Screens.SecondaryNavBar = {
  navBarTransparent: true,
  navBarBackgroundColor: 'white',
  statusBarColor: global.Colors.Primary,
  navBarButtonColor: global.Colors.Primary,
  navBarTextColor: global.Colors.Primary,
  statusBarTextColorScheme: Platform.OS === 'ios' ? 'dark' : 'light',
  navBarHidden: false,
  topBarElevationShadowEnabled: false
}

global.Screens.TransparentNavBar = {
  navBarTransparent: true,
  navBarTranslucent: true,
  drawUnderNavBar: true,
  statusBarColor: global.Colors.Primary,
  topBarElevationShadowEnabled: false,
  navBarButtonColor: 'white',
  navBarTextColor: 'white',
  statusBarTextColorScheme: 'light',
  navBarHidden: false
}

global.Screens.NoNavBar = {
  orientation: 'portrait',
  statusBarColor: global.Colors.Primary,
  hideBackButtonTitle: true,
  navBarHidden: true
}

global.Screens.NoNavBarAuto = {
  navBarHidden: true,
  statusBarColor: global.Colors.Primary,
  orientation: 'auto',
  hideBackButtonTitle: true
}
