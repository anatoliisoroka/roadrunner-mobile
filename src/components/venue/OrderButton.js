import React, { Component } from 'react'
import { StyleSheet, View, Alert } from 'react-native'

import Button from '../../components/shared/Button'

import Backend from '../../utils/Backend'

const PENDING = 'pending'
const ACCEPTED = 'accepted'
const REJECTED = 'rejected'
const CANCELLED = 'cancelled'
const FOOD_PREPARING = 'food_preparing'
const PREPARING = 'preparing'
const FINISHED = 'finished'

export default class OrderButton extends Component {
  constructor(props) {
    super(props)
    this.state = {
      status: props.status,
      foodStatus: props.foodStatus,
      title: null,
      textStyle: null,
      style: null
    }
  }

  componentDidMount() {
    this._setButton()
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps)
  }

  _showCompleteOrderAlert() {
    Alert.alert(
      'Complete Order',
      'Are you sure you want to complete this order?',
      [
        {
          text: 'Yes',
          onPress: () => this._updateStatus(this.state.status, FINISHED)
        },
        {
          text: 'No',
          style: 'cancel'
        }
      ]
    )
  }

  _setButton() {
    let { status, foodStatus } = this.state

    if (status === PENDING && foodStatus === PENDING) {
      title = 'Accept'
      textStyle = styles.baseText
      style = accept
    } else if (status === ACCEPTED && foodStatus === PENDING) {
      title = 'Prepare Order'
      textStyle = styles.baseText
      style = prepare
    } else if (status === ACCEPTED && foodStatus === PREPARING) {
      title = 'Complete Order'
      textStyle = styles.baseText
      style = complete
    } else {
      return null
    }
    this.setState({ title, textStyle, style })
  }

  _buttonPressed() {
    let { status, foodStatus } = this.state
    if (status === PENDING && foodStatus === PENDING) {
      title = 'Accepted'
      textStyle = acceptedText
      style = accepted
      this.setState({ title, textStyle, style })
      setTimeout(() => {
        this._updateStatus(ACCEPTED, this.state.foodStatus)
      }, 1000)
    }
    if (status === ACCEPTED && foodStatus === PENDING) {
      this._updateStatus(this.state.status, PREPARING)
    }
    if (status === ACCEPTED && foodStatus === PREPARING) {
      this._showCompleteOrderAlert()
    }
  }

  _updateStatus(status, foodStatus) {
    let { order } = this.state
    this.setState({ status, foodStatus }, () => {
      this.props.onOrderStatusUpdated(status, foodStatus)
      if (status == ACCEPTED && foodStatus == PENDING) {
        return
      }
      this._setButton()
    })
  }

  _renderButton() {
    return (
      <Button
        title={this.state.title}
        style={[this.state.style, styles.button]}
        textStyle={this.state.textStyle}
        onPress={() => this._buttonPressed()}
      />
    )
  }

  render() {
    return <View>{this._renderButton()}</View>
  }
}

const accept = {
  backgroundColor: global.Colors.Green,
  borderColor: '#transparent',
  borderWidth: 0
}

const accepted = {
  backgroundColor: '#fff',
  borderColor: global.Colors.Green,
  borderWidth: 2
}

const prepare = {
  backgroundColor: global.Colors.Primary,
  borderColor: '#transparent',
  borderWidth: 0
}

const acceptedText = {
  color: global.Colors.Green
}

const complete = {
  backgroundColor: global.Colors.Green,
  borderColor: '#transparent',
  borderWidth: 0
}

const styles = StyleSheet.create({
  button: { marginTop: 10 },
  baseText: { color: 'white' }
})
