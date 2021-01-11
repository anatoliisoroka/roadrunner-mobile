import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'

import Button from 'apsl-react-native-button'

const FONT_SIZE = 15
const FONT_WEIGHT = '600'
const BUTTON_HEIGHT = 40

export default class DietaryListItem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dietary: props.dietary
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps)
  }

  _onItemPressed() {
    let { dietary } = this.state
    dietary.selected = !dietary.selected
    this.setState({ dietary }, () => {
      this.props.onItemPressed(dietary)
    })
  }

  _getButtonStyle() {
    let { dietary } = this.state
    return dietary.selected
      ? [styles.selectedButton, styles.button]
      : styles.button
  }

  render() {
    let { dietary } = this.state
    return (
      <Button
        style={this._getButtonStyle()}
        textStyle={dietary.selected ? styles.selectedText : styles.text}
        onPress={() => this._onItemPressed()}
      >
        {dietary.title}
      </Button>
    )
  }
}

const styles = StyleSheet.create({
  button: {
    height: BUTTON_HEIGHT,
    borderColor: global.Colors.Primary,
    marginRight: 10,
    paddingLeft: 5,
    paddingRight: 5,
    borderWidth: 2,
    minWidth: 50
  },
  text: {
    color: global.Colors.Primary,
    fontSize: FONT_SIZE,
    fontWeight: FONT_WEIGHT
  },
  selectedButton: {
    color: 'white',
    backgroundColor: global.Colors.Primary
  },
  selectedText: {
    color: 'white',
    fontSize: FONT_SIZE,
    fontWeight: FONT_WEIGHT
  }
})
