import React, { Component } from 'react'
import { View, Image } from 'react-native'

import ConfigHelper from '../../utils/ConfigHelper'

export default class NavBarLogo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      content: props.content
    }
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Image
          style={{ width: 100, height: 35 }}
          resizeMode="contain"
          source={ConfigHelper.getLogo()}
        />
      </View>
    )
  }
}
