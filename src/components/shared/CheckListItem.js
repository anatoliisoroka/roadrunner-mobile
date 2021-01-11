import React, { Component } from 'react'
import { View, Image } from 'react-native'
import Text from 'react-native-text'

import BasicListItem from './BasicListItem'

export default class CheckListItem extends Component {
  constructor(props) {
    super(props)
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps)
  }

  _getRightIcon(isSelected) {
    let rightIcon = <View />
    if (isSelected) {
      rightIcon = {
        name: 'check',
        type: 'material-community',
        color: global.Colors.Primary
      }
    }
    return rightIcon
  }

  render() {
    return (
      <BasicListItem
        {...this.props}
        rightIcon={this._getRightIcon(this.props.isChecked)}
      />
    )
  }
}

CheckListItem.defaultProps = {
  isChecked: false
}
