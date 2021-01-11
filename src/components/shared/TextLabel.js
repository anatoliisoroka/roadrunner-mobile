import React, { Component } from 'react'
import Text from 'react-native-text'

import ShimmerPlaceHolder from 'react-native-shimmer-placeholder'

import PropTypes from 'prop-types'

type Props = {}

export default class TextLabel extends Component<Props> {
  constructor(props) {
    super(props)

    let fontSize = props.style ? props.style['fontSize'] : null
    if (fontSize == null) {
      fontSize = 14
    }

    let shimmerWidth = fontSize * 7
    let shimmerHeight = fontSize

    this.state = {
      shimmerWidth,
      shimmerHeight,
      shimmer: props.shimmer
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps)
  }

  render() {
    return (
      <ShimmerPlaceHolder
        autoRun={true}
        visible={!this.state.shimmer}
        width={this.state.shimmerWidth}
        height={this.state.shimmerHeight}
        style={{
          marginBottom: 20,
          borderRadius: 20
        }}
      >
        <Text {...this.props} />
      </ShimmerPlaceHolder>
    )
  }
}

TextLabel.propTypes = {
  shimmer: PropTypes.boolean
}

TextLabel.defaultProps = {
  shimmer: false
}
