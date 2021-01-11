import React, { Component } from 'react'
import { StyleSheet, Text, View, SafeAreaView, SectionList } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { ListItem } from 'react-native-elements'

import LoadingView from '../../components/shared/LoadingView'
import Button from '../../components/shared/Button'
import AuthManager from '../../utils/AuthManager'

import screenStyles from '../../assets/css/screens'

const MANAGE_PASSWORDS = {
  title: 'Manage Passwords',
  destination: global.Screens.ManagePasswords
}
const TOTAL_INCOME = {
  title: 'View Total Income',
  destination: global.Screens.TotalIncome
}
const ABOUT = {
  title: 'About',
  destination: global.Screens.About
}
const FEEDBACK = {
  title: 'Feedback',
  destination: global.Screens.Feedback
}
const SECTIONS_INFO_DATA = [MANAGE_PASSWORDS, TOTAL_INCOME]
const SECTIONS_OTHER_DATA = [ABOUT]
const SECTIONS = [
  {
    title: 'Restaurant Information',
    data: SECTIONS_INFO_DATA
  },
  { title: 'Other', data: SECTIONS_OTHER_DATA }
]
export default class Profile extends Component {
  static navigatorStyle = global.Screens.PrimaryNavBar

  constructor(props) {
    super(props)
    this.state = {
      isUpdating: false
    }
  }

  componentWillMount() {
    this.props.navigator.setTitle({ title: 'Settings' })
  }

  _goTo(destination) {
    this.props.navigator.resetTo({
      screen: destination
    })
  }

  _onListItemPressed(item) {
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
        this._goTo(global.Screens.Landing)
      })
      .catch(error => {
        this.setState({ isUpdating: false })
        alert(error.message)
      })
  }

  render() {
    return (
      <View style={styles.mainContainer}>
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
        <Button
          title="Log out"
          style={styles.button}
          textStyle={styles.buttonText}
          onPress={() => this._logOut()}
        />
        <LoadingView isLoading={this.state.isUpdating} size="small" />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-end',
    backgroundColor: global.Colors.ScreenBackground
  },
  button: {
    backgroundColor: 'transparent',
    borderColor: 'red',
    borderWidth: 2,
    marginTop: 20,
    marginBottom: 20
  },
  buttonText: { color: 'red' },
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
