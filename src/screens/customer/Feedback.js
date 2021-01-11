import React, { Component } from 'react'
import {
  StyleSheet,
  Platform,
  View,
  Text,
  Image,
  TextInput
} from 'react-native'

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import Button from '../../components/shared/Button'
import Rating from '../../components/customer/Rating'
import FeedbackInput from '../../components/customer/FeedbackInput'
import LoadingView from '../../components/shared/LoadingView'

import screenStyles from '../../assets/css/screens'

import AuthManager from '../../utils/AuthManager'
import Backend from '../../utils/Backend'

const FEEDBACK = require('../../assets/images/feedback.png')

const PLATFORM_APP = 'app'

export default class Feedback extends Component {
  static navigatorStyle = global.Screens.SecondaryNavBar

  constructor(props) {
    super(props)
    this.state = {
      description: '',
      sending: false
    }
  }

  componentDidMount() {
    this.props.navigator.setTitle({ title: 'Feedback' })
  }

  _isValid() {
    let isValid = true
    let rating = this.rating.getValue()

    if (rating == 0) {
      alert('Please rate')
      isValid = false
    }
    return isValid
  }

  _handleFeedback() {
    if (!this._isValid()) {
      return
    }

    this._submitFeedback()
  }
  _submitFeedback() {
    let { description, sending } = this.state

    if (sending) {
      return
    }

    this.setState({ sending: true })

    let feedbackData = {
      description: description.length > 0 ? description : null,
      rating: this.rating.getValue(),
      device: Platform.OS,
      platform: PLATFORM_APP
    }

    Backend.submitFeedback(feedbackData)
      .then(response => {
        alert('Thanks, Your feedback has been submitted.')
        this.setState({ sending: false }, () => {
          this._reset()
        })
      })
      .catch(error => {
        console.warn(error.message)
        this.setState({ sending: false })
      })
  }

  _reset() {
    this.setState({ value: 0, description: '' })
  }

  render() {
    let { description, sending } = this.state
    return (
      <KeyboardAwareScrollView>
        <View style={screenStyles.centerHorizontalPaddedContainer}>
          <Image source={FEEDBACK} />
          <Text style={styles.text}>
            Your feedback helps us improve Roadrunner
          </Text>
          <Text style={[styles.text, styles.bottomText]}>
            Don't be afraid to be honest.
          </Text>
          <FeedbackInput
            description={description}
            ref={description => {
              this.description = description
            }}
            onChangeText={description => this.setState({ description })}
          />
          <Rating
            value={this.state.value}
            ref={rating => {
              this.rating = rating
            }}
          />
          <Button
            type="tertiary"
            title="Send Feedback"
            style={styles.button}
            onPress={() => this._handleFeedback()}
          />
          <LoadingView isLoading={sending} size="small" />
        </View>
      </KeyboardAwareScrollView>
    )
  }
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center'
  },
  bottomText: {
    marginBottom: 20
  },
  button: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 40
  }
})
