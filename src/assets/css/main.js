import { StyleSheet } from 'react-native'
import { ifIphoneX } from 'react-native-iphone-x-helper'

export default StyleSheet.create({
  checkboxContainer: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingHorizontal: 0
  },
  floatingBorderlessButtonStyle: {
    margin: 0,
    padding: 0,
    marginTop: 0,
    marginBottom: 0,
    borderRadius: 0,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
  },
  topRightButtonContainer: {
    position: 'absolute',
    right: '5%',
    top: '5%'
  },
  textInputContainer: {
    borderRadius: 5,
    backgroundColor: '#f7f7f7',
    borderBottomWidth: 0,
    marginLeft: 0,
    marginRight: 10,
    width: '100%'
  },
  venueSearchBar: {
    flex: 1,
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    width: '100%',
    ...ifIphoneX(
      {
        height: 70
      },
      {
        height: 60
      }
    ),

    backgroundColor: '#f7f7f7'
  },
  profileButton: {
    position: 'absolute',
    ...ifIphoneX(
      {
        top: 45
      },
      {
        top: 30
      }
    ),
    right: 25,
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 8,
    shadowOpacity: 0.4,
    shadowRadius: 2,
    shadowColor: 'black',
    elevation: 1,
    shadowOffset: { height: 2, width: 0 }
  }
})
