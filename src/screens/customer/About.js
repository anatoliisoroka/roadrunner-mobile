import React, { Component } from 'react'
import {
  StyleSheet,
  Platform,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Linking
} from 'react-native'

import Button from 'apsl-react-native-button'

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import CallHelper from '../../utils/CallHelper'
import DateTime from '../../utils/DateTime'

import screenStyles from '../../assets/css/screens'

const LOGO = require('../../assets/logos/roadrunner.png')

type Props = {}
export default class About extends Component<Props> {
  static navigatorStyle = global.Screens.SecondaryNavBar
  constructor(props) {
    super(props)
    this.state = {
      description: ''
    }
  }

  componentDidMount() {
    this.props.navigator.setTitle({ title: 'About' })
  }

  _getYear() {
    return DateTime.year()
  }

  _goTo(url) {
    if (url === global.Api.Terms) {
      title = 'Terms & Conditions'
    } else {
      title = 'Privacy Policy'
    }
    this.props.navigator.push({
      screen: global.Screens.Web,
      passProps: {
        url,
        title
      }
    })
  }

  _call() {
    let number = '0857327698'
    CallHelper.call(number)
  }

  render() {
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={screenStyles.centerHorizontalPaddedContainer}
      >
        <Image source={LOGO} style={styles.logo} />
        <Text style={styles.text}>If you have any queries, contact us at:</Text>
        <TouchableOpacity
          onPress={() => Linking.openURL('mailto:info@roadrunnershopping.com')}
        >
          <Text style={styles.callText}>info@roadrunnershopping.com</Text>
        </TouchableOpacity>

        <View style={styles.footerContainer}>
          <Text style={{ fontWeight: '200', fontSize: 15 }}>
            {this._getYear()} Roadrunner
          </Text>
          <View style={styles.bottomButtonContainer}>
            <Button
              style={styles.button}
              textStyle={styles.buttonText}
              onPress={() => this._goTo(global.Api.Terms)}
            >
              Terms & Condition
            </Button>
            <Button
              style={styles.button}
              textStyle={styles.buttonText}
              onPress={() => this._goTo(global.Api.Policy)}
            >
              Privacy Policy
            </Button>
          </View>
        </View>
      </KeyboardAwareScrollView>
    )
  }
}

const styles = StyleSheet.create({
  text: {
    fontWeight: '500',
    fontSize: 17,
    marginBottom: 2,
    textAlign: 'center'
  },
  footerContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 10
  },
  bottomButtonContainer: {
    width: '100%',
    flexDirection: 'row',
    marginTop: 15
  },
  button: {
    width: '50%',
    borderWidth: 0
  },
  buttonText: {
    fontSize: 15,
    color: global.Colors.Primary
  },
  callText: {
    marginTop: 5,
    fontWeight: '600',
    fontSize: 18,
    color: global.Colors.Primary
  },
  logo: {
    marginTop: 10,
    flex: 1,
    resizeMode: 'contain',
    height: 100,
    width: 200
  }
})
