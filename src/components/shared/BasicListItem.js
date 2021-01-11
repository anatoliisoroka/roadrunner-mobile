import React, { Component } from 'react'
import { View, Image } from 'react-native'
import Text from 'react-native-text'

import { ListItem } from 'react-native-elements'

export default class BasicListItem extends Component {
  constructor(props) {
    super(props)
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps)
  }

  render() {
    return (
      <ListItem
        containerStyle={{ paddingTop: 30, paddingBottom: 30, color: 'red' }}
        {...this.props}
      />
    )
  }
}
