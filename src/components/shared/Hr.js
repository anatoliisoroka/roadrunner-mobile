import React, { Component } from 'react'
import { View } from 'react-native'

type Props = {}
export default class Hr extends Component<Props> {
  constructor(props) {
    super(props)
    this.state = {
      color: props.color,
      width: props.width
    }
  }
  render() {
    return (
      <View
        style={[
          {
            height: 1,
            backgroundColor: this.state.color
          },
          this.props.style
        ]}
      />
    )
  }
}

Hr.defaultProps = {
  width: '100%',
  color: 'lightgrey'
}
