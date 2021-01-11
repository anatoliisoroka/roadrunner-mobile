import React, { Component } from 'react'
import { View, Image, TouchableOpacity } from 'react-native'
import Text from 'react-native-text'

import Ratings from '../../utils/Ratings'

import { ListItem } from 'react-native-elements'

export default class TopRatedFeedListItem extends Component {
  constructor(props) {
    super(props)
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps)
  }

  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <View
          style={{
            marginRight: 10,
            marginTop: 20,

            width: 225
          }}
        >
          <Image
            style={{ width: 225, height: 120, resizeMode: 'cover' }}
            source={{ uri: this.props.image }}
          />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: 225
            }}
          >
            <Text
              style={{
                fontSize: 15,
                fontWeight: '500',
                marginTop: 10,
                marginRight: 5,
                flexShrink: 4
              }}
              numberOfLines={1}
            >
              {this.props.title}
            </Text>
            <Text
              style={{
                fontSize: 13,
                fontWeight: '500',
                marginTop: 10,
                marginRight: 3,
                color: global.Colors.Primary
              }}
            >
              {Ratings.round(this.props.rating)} Rating
            </Text>
            <Text style={{ fontSize: 13, fontWeight: '300', marginTop: 10 }}>
              {Ratings.format(this.props.totalRating)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}
