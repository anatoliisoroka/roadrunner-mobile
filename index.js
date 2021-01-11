import './src/constants/Colors'
import './src/constants/Screens'
import './src/constants/Auth'
import './src/constants/Api'
import './src/constants/Broadcast'
import './src/constants/Config'
import './src/constants/General'
import './src/constants/Event'

import { registerScreens, startApp, startAppWith } from './src/screens'

registerScreens()
startApp()
// startAppWith(global.Screens.SignUp, global.Screens.PrimaryNavBar)

console.disableYellowBox = true
