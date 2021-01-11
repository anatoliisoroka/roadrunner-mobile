import React, { Component } from 'react'
import { View, Image } from 'react-native'
import Text from 'react-native-text'

import { Icon } from 'react-native-elements'

import textStyles from '../../assets/css/text'

export default class FeedListTitle extends Component {
  constructor(props) {
    super(props)
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps)
  }

  _renderIcon() {
    if (this.props.showIcon === false) {
      return
    }
    return (
      <Icon
        name="chevron-right-circle-outline"
        type="material-community"
        color={global.Colors.Primary}
        size={30}
        onPress={this.props.onPress}
      />
    )
  }

  render() {
    return (
      <View
        style={{
          justifyContent: 'space-between',
          flexDirection: 'row',
          marginTop: 10,
          marginRight: 20,
          marginLeft: 20
        }}
      >
        <Text style={textStyles.feedTitleText}>{this.props.title}</Text>
        {this._renderIcon()}
      </View>
    )
  }
}
