import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  SectionList
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { FormInput, ListItem } from 'react-native-elements'

import LoadingView from '../../components/shared/LoadingView'
import AuthManager from '../../utils/AuthManager'

import screenStyles from '../../assets/css/screens'

import BIKE from '../../assets/icons/bike.png'

const MY_ORDERS = {
  title: 'My Orders',
  destination: global.Screens.Orders
}
const MY_DETAILS = {
  title: 'My Details',
  destination: global.Screens.ProfileDetails
}
const PAYMENT_METHODS = {
  title: 'Payment Methods',
  destination: global.Screens.Payment
}
const DELIVERY_ADDRESSES = {
  title: 'Delivery Addresses',
  destination: global.Screens.Addresses
}
const DIETARIES = {
  title: 'Dietaries',
  destination: global.Screens.Dietaries
}
const ABOUT = {
  title: 'About',
  destination: global.Screens.About
}
const FEEDBACK = {
  title: 'Feedback',
  destination: global.Screens.Feedback
}
const LOG_OUT = {
  title: 'Log Out',
  destination: global.Screens.Landing
}
const SECTIONS_ORDER_DATA = [MY_ORDERS]
const SECTIONS_INFO_DATA = [
  MY_DETAILS,
  PAYMENT_METHODS,
  DELIVERY_ADDRESSES,
  DIETARIES
]
const SECTIONS_OTHER_DATA = [ABOUT, FEEDBACK, LOG_OUT]
const SECTIONS = [
  { title: 'Orders', data: SECTIONS_ORDER_DATA },
  {
    title: 'Personal Information',
    data: SECTIONS_INFO_DATA
  },
  { title: 'Other', data: SECTIONS_OTHER_DATA }
]
export default class Profile extends Component {
  static navigatorStyle = global.Screens.PrimaryNavBar
  // static navigatorButtons = {
  //   rightButtons: [{ icon: BIKE }]
  // }
  constructor(props) {
    super(props)
    this.state = {
      isUpdating: false
    }
  }

  componentWillMount() {
    this.props.navigator.setTitle({ title: 'Profile' })
  }

  _onListItemPressed(item) {
    if (item.title === LOG_OUT.title) {
      this._logOut()
      return
    }
    if (!item.destination) {
      return
    }
    this._goTo(item.destination)
  }

  _goTo(destination) {
    this.props.navigator.push({
      screen: destination
    })
  }

  _logOut() {
    this.setState({ isUpdating: true })
    AuthManager.logOut()
      .then(() => {
        this.setState({ isUpdating: false })
        this.props.navigator.resetTo({
          screen: global.Screens.Splash
        })
      })
      .catch(error => {
        this.setState({ isUpdating: false })
        console.log(error.message)
        alert(error.message)
      })
  }

  render() {
    return (
      <View style={screenStyles.mainContainer}>
        <SectionList
          sections={SECTIONS}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.headerTitle}>{title}</Text>
          )}
          renderItem={({ item, index, section }) => (
            <ListItem
              key={index}
              onPress={() => this._onListItemPressed(item)}
              title={item.title}
              hideChevron={true}
              containerStyle={styles.headerTitleContainer}
              titleContainerStyle={styles.titleContainer}
              titleStyle={styles.title}
            />
          )}
          keyExtractor={(item, index) => item + index}
        />
        <LoadingView isLoading={this.state.isUpdating} size="small" />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#909090',
    marginLeft: 10,
    paddingTop: 10,
    marginBottom: 10,
    backgroundColor: 'white'
  },
  headerTitleContainer: {
    marginLeft: 25,
    marginRight: 20,
    marginBottom: 10,
    borderBottomColor: '#e2e2e2'
  },
  title: {
    fontSize: 15,
    fontWeight: '500',
    color: 'black'
  },
  titleContainer: {
    marginLeft: -20,
    marginBottom: 5
  }
})
