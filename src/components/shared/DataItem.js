import React, { Component } from 'react'
import { View, Image } from 'react-native'
import Text from 'react-native-text'

export default class DataItem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      label: props.label,
      value: props.value,
      labelTextStyle: props.labelTextStyle,
      valueTextStyle: props.valueTextStyle
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps)
  }

  render() {
    return (
      <View style={[{ flexDirection: 'row' }, this.state.containerStyle]}>
        <Text style={[{ flex: 1, fontSize: 16 }, this.state.labelTextStyle]}>
          {this.state.label + ':'}
        </Text>
        <Text
          style={[{ fontSize: 16, color: 'gray' }, this.state.valueTextStyle]}
        >
          {this.state.value}
        </Text>
      </View>
    )
  }
}

DataItem.defaultProps = {}
