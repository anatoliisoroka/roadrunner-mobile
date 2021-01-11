import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'

import Button from 'apsl-react-native-button'

const FONT_SIZE = 16
const FONT_WEIGHT = '600'
const BUTTON_HEIGHT = 40

export default class FilterListItem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selected: props.selected
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps)
  }

  _onItemPressed() {
    let { selected } = this.state
    if (selected) {
      this.props.onItemUnselected()
    } else {
      this.props.onItemSelected()
    }
  }

  render() {
    return (
      <Button
        style={
          this.state.selected
            ? [styles.selectedButton, styles.button]
            : styles.button
        }
        textStyle={this.state.selected ? styles.selectedText : styles.text}
        onPress={() => this._onItemPressed()}
      >
        {this.props.title}
      </Button>
    )
  }
}

FilterListItem.defaultProps = {
  onItemUnselected: () => {}
}

const styles = StyleSheet.create({
  button: {
    height: BUTTON_HEIGHT,
    borderColor: global.Colors.Primary,
    marginRight: 10,
    paddingLeft: 5,
    paddingRight: 5,
    borderWidth: 2
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
