import { StyleSheet } from 'react-native'

centerHorizontalPaddedContainer = {
  flexGrow: 1,
  backgroundColor: global.Colors.ScreenBackground,
  alignItems: 'center',
  padding: 20,
  backgroundColor: 'white'
}

export default StyleSheet.create({
  centerContainer: {
    flexGrow: 1,
    backgroundColor: global.Colors.ScreenBackground,
    justifyContent: 'center',
    alignItems: 'center'
  },

  centerPaddedContainer: {
    flexGrow: 1,
    backgroundColor: global.Colors.ScreenBackground,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },

  whitePage: {
    height: '100%',
    width: '100%',
    backgroundColor: 'white'
  },

  centerHorizontalPaddedContainer: centerHorizontalPaddedContainer,

  greyCenterHorizontalPaddedContainer: {
    ...centerHorizontalPaddedContainer,
    backgroundColor: '#e5e5e5'
  },

  centerVerticalPaddedContainer: {
    flexGrow: 1,
    backgroundColor: global.Colors.ScreenBackground,
    justifyContent: 'center',
    padding: 20
  },
  mainContainer: {
    flexGrow: 1,
    backgroundColor: global.Colors.ScreenBackground,
    padding: 10
  },
  mainPaddedContainer: {
    flexGrow: 1,
    backgroundColor: global.Colors.ScreenBackground,
    padding: 20
  },
  fullScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    height: '100%'
  }
})
