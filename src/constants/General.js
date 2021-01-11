import { Dimensions } from 'react-native'
let { width, height } = Dimensions.get('window')

global.General = {}
global.General.PLATFORM_APP = 'app'

global.Sizes = {}
global.Sizes.SCREEN_WIDTH = width

global.StorageKeys = {}
global.StorageKeys.SkippedReviewOrderId = 'SKIPPED_REVIEW_ORDER_ID'
global.StorageKeys.LocationPermissionAsked = 'LOCATION_PERMISSION_ASKED'
global.StorageKeys.hasOnboarded = 'HAS_ONBOARDED'

global.General.FacebookProvider = 'facebook'
global.General.GoogleWebClientId =
  '582507719950-0h0psgmcjgjbc9dulgt0rqn4hvq3sgnr.apps.googleusercontent.com'

global.General.GoogleiOSClientId =
  '582507719950-peoov5u75oinovj5tjukvgje9uu4culm.apps.googleusercontent.com'

global.General.GoogleAndroidClientId =
  '582507719950-9frp2pqlddsr4276uf5nvas46mh6hndc.apps.googleusercontent.com'

global.General.GoogleProvider = 'google-oauth2'

global.General.InitialOrder = null
