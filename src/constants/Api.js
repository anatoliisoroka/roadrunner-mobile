import ConfigHelper from '../utils/ConfigHelper'
import { Platform } from 'react-native'

global.Api = {}

global.Api.IsDebug = true
// global.Api.Domain = ConfigHelper.getDomain()

global.Api.Base = global.Api.IsDebug
  ? 'https://roadrunner-api-dev.herokuapp.com'
  : 'https://roadrunner-api-live.herokuapp.com'


global.Api.Login = global.Api.Base + '/user/login'
global.Api.Logout = global.Api.Base + '/user/logout'
global.Api.RefreshToken = global.Api.Base + '/user/login/refresh'
global.Api.UserInfo = global.Api.Base + '/user/info'
global.Api.RequestResetPassword = global.Api.Base + '/user/requestResetPassword'
global.Api.ResetPassword = global.Api.Base + '/user/resetPassword'
global.Api.RequestPhoneVerification = global.Api.Base + '/user/requestPhoneVerification'
global.Api.VerifyPhone = global.Api.Base + '/user/verifyPhone'

global.Api.Venues = global.Api.Base + '/venues'
global.Api.Filters = global.Api.Base + '/filters'
global.Api.Feedback = global.Api.Base + '/feedback'
global.Api.Reviews = global.Api.Base + '/reviews'
global.Api.Coupons = global.Api.Base + '/coupons'

global.Api.Cards = global.Api.Base + '/cards'
global.Api.Categories = global.Api.Base + '/categories'
global.Api.Dietaries = global.Api.Base + '/dietaries'

global.Api.Menu = global.Api.Base + '/menus'
global.Api.Orders = global.Api.Base + '/orders'
global.Api.Customers = global.Api.Base + '/customers'

global.Api.Locations = global.Api.Base + '/locations'
global.Api.DeliveryFee = global.Api.Base + '/delivery-fee'

global.Api.Terms = 'https://www.roadrunner.menu/terms-conditions'
global.Api.Policy = 'https://www.roadrunner.menu/privacy-policy'

global.Api.CompanyMembers = global.Api.Base + '/company-members'
global.Api.Earnings = global.Api.Base + '/earnings'

global.Api.Facebook = {}

global.Api.Google = {}

global.Api.Facebook.RedirectUri = global.Api.Base + '/'
global.Api.Google.RedirectUri = global.Api.Base + '/'
global.Api.FacebookCode = global.Api.Base + '/user/facebook-code'

global.Api.SocialLogin = global.Api.Base + '/user/login/social/jwt-pair-user/'

global.Api.GMapsKey =
  Platform.OS === 'ios'
    ? 'AIzaSyCKLLo-qnKup_TD0emmNnjgkcf17yoePL8'
    : 'AIzaSyCI_goCXNEjgq-_4NNgLX6bPwL7_SMuMj0'

// notifications
global.Api.DeviceTokenAPNS = global.Api.Base + '/user/device/apns'
global.Api.DeviceTokenFCM = global.Api.Base + '/user/device/gcm'

global.Api.Track = global.Api.Base + '/track'

global.Api.Key = {}

global.Api.Key.FCM_SENDER_ID = '582507719950'

global.Api.DeviceToken = null
