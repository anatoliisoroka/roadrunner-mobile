import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Animated,
  Easing,
  ScrollView,
  Dimensions
} from 'react-native'

import PropTypes from 'prop-types'

import Button from 'apsl-react-native-button'

type Props = {}

const FONT_SIZE = 16
const FONT_WEIGHT = '800'
export const styles = StyleSheet.create({
  base: {
    margin: 0,
    marginTop: 0
  },
  primary: {
    borderWidth: 0,
    backgroundColor: global.Colors.Primary
  },
  primaryText: {
    color: 'white',
    fontSize: FONT_SIZE,
    fontWeight: FONT_WEIGHT
  },
  secondary: {
    borderWidth: 1,
    borderColor: 'transparent',
    backgroundColor: 'transparent'
  },
  secondaryText: {
    color: global.Colors.Secondary,
    fontSize: FONT_SIZE,
    fontWeight: FONT_WEIGHT
  },
  tertiary: {
    borderWidth: 0,
    backgroundColor: global.Colors.Secondary
  },
  tertiaryText: {
    color: 'white',
    fontSize: FONT_SIZE,
    fontWeight: FONT_WEIGHT
  },
  quaternary: {
    borderWidth: 1,
    borderColor: 'transparent',
    backgroundColor: 'transparent'
  },
  quaternaryText: {
    color: global.Colors.Primary,
    fontSize: FONT_SIZE,
    fontWeight: FONT_WEIGHT
  }
})

export default class CustomButton extends Component<Props> {
  constructor(props) {
    super(props)
    this.state = {
      title: props.title,
      type: props.type,
      style: props.style,
      textStyle: props.textStyle,
      isLoading: props.isLoading,
      isDisabled: props.isDisabled
    }
  }
  componentWillReceiveProps(nextProps) {
    this.setState(nextProps)
  }
  _getTextStyle() {
    switch (this.state.type) {
      case 'primary':
        return styles.primaryText
      case 'secondary':
        return styles.secondaryText
      case 'tertiary':
        return styles.tertiaryText
      case 'quaternary':
        return styles.quaternaryText
    }
  }
  render() {
    return (
      <Button
        style={[styles.base, styles[this.props.type], this.state.style]}
        textStyle={[this._getTextStyle(), this.props.textStyle]}
        onPress={this.props.onPress}
        isLoading={this.state.isLoading}
        isDisabled={this.state.isDisabled}
      >
        {this.state.title}
      </Button>
    )
  }
}

CustomButton.propTypes = {
  title: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['primary', 'secondary', 'tertiary', 'quaternary'])
}

CustomButton.defaultProps = {
  type: 'primary',
  style: {},
  textStyle: {},
  isLoading: false,
  isDisabled: false
}
