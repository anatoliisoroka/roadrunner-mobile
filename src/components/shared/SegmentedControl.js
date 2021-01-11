import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import Text from 'react-native-text'

import { ButtonGroup } from 'react-native-elements'

const conditionalStyle = (condition, style) => (condition ? style : {})

const ACTIVE_OPACITY = 0.8
const DISABLED_OPACITY = 1
export default class SegmentedControl extends Component {
  constructor(props) {
    super(props)
    this.state = {
      disabled: props.disabled
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps)
  }

  _getTextStyle() {
    let { disabled } = this.state
    return disabled ? styles.disabledText : styles.text
  }

  render() {
    let { disabled } = this.state
    return (
      <ButtonGroup
        onPress={disabled ? () => {} : this.props.onPress}
        selectedIndex={this.props.selectedIndex}
        buttons={this.props.buttons}
        buttonStyle={{ backgroundColor: 'white' }}
        containerStyle={[styles.container(disabled), this.props.style]}
        selectedButtonStyle={styles.selectedButton}
        selectedTextStyle={{ color: 'white' }}
        textStyle={this._getTextStyle()}
        innerBorderStyle={styles.innerBorder}
        activeOpacity={disabled ? DISABLED_OPACITY : ACTIVE_OPACITY}
      />
    )
  }
}

SegmentedControl.defaultProps = {
  disabled: false
}

const styles = StyleSheet.create({
  container: disabled => ({
    height: 36,
    borderWidth: 2,
    backgroundColor: 'white',
    marginTop: 0,
    marginBottom: 0,
    borderColor: disabled ? 'gray' : global.Colors.Primary,
    borderRadius: 5
  }),
  selectedButton: { backgroundColor: global.Colors.Primary },

  text: { color: global.Colors.Primary },

  disabledText: { color: 'gray' },

  innerBorder: { color: global.Colors.Primary }
})
