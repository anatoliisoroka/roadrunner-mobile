import React, { Component } from 'react'
import { View, Image, TouchableOpacity } from 'react-native'
import Text from 'react-native-text'

export default class CategoryFeedListItem extends Component {
  constructor(props) {
    super(props)
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps)
  }

  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <View style={{ marginRight: 10, marginTop: 8 }}>
          <Image
            style={{ width: 140, height: 75 }}
            source={{ uri: this.props.image }}
          />
          <Text
            numberOfLines={1}
            style={{
              fontSize: 13,
              fontWeight: '500',
              marginTop: 5,
              width: 140
            }}
          >
            {this.props.title}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }
}
