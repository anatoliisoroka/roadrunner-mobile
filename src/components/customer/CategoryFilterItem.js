import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'

import { CheckBox } from 'react-native-elements'

export default class CategoryFilterItem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selected: props.selected,
      category: props.category
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps)
  }

  _itemChecked() {
    let { selected } = this.state
    if (selected) {
      this.props.onItemUnselected()
    } else {
      this.props.onItemSelected()
    }
  }

  render() {
    return (
      <CheckBox
        containerStyle={styles.container}
        title={this.state.category.title}
        right
        checked={this.state.selected}
        onPress={() => this._itemChecked()}
        iconRight
        textStyle={styles.text}
        checkedColor={global.Colors.Primary}
      />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 0,
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderColor: '#e2e2e2',
    marginLeft: 10,
    marginRight: 10
  },
  text: {
    textAlign: 'left',
    width: '95%',
    paddingLeft: 10,
    fontSize: 16,
    fontWeight: '500'
  }
})
