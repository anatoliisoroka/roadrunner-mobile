import React, { Component } from 'react'
import { View } from 'react-native'
import Text from 'react-native-text'

import textStyles from '../../assets/css/text'
import screenStyles from '../../assets/css/screens'

type Props = {}
export default class NoResults extends Component<Props> {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    return (
      <View style={[screenStyles.centerContainer, this.props.style]}>
        <Text style={textStyles.noResult}>{this.props.title}</Text>
      </View>
    )
  }
}

NoResults.defaultProps = {
  title: 'No results found.'
}
