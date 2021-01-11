import React, { Component } from 'react'
import { View, Image } from 'react-native'
import Text from 'react-native-text'

export default class InputDataItem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      label: props.label,
      value: props.value,
      labelTextStyle: props.labelTextStyle,
      highlight: props.highlight,
      color: props.highlight ? global.Colors.Primary : 'black'
    }
  }
  render() {
    return (
      <View
        style={[
          {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 20,
            alignItems: 'center'
          },
          this.props.containerStyle
        ]}
      >
        <Text style={[{ fontSize: 18, flex: 1 }, this.state.labelTextStyle]}>
          {this.state.label}
        </Text>
        {/* FIXME: layout is messed up for Android and iOS pickers */}
        <View style={{ alignItems: 'flex-end' }}>
          {this.props.renderInput()}
        </View>
      </View>
    )
  }
}

InputDataItem.defaultProps = {
  highlight: false,
  textStyle: {},
  containerStyle: {},
  renderInput: () => {}
}
