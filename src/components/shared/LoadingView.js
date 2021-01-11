import React, { Component } from 'react'
import { StyleSheet, View, ActivityIndicator } from 'react-native'

import PropTypes from 'prop-types'

export default class LoadingView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: props.isLoading,
      size: props.size
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps)
  }

  render() {
    if (!this.state.isLoading) {
      return null
    }

    return (
      <View style={[styles.main, this.props.style]}>
        <ActivityIndicator
          color={global.Colors.Secondary}
          size={this.state.size}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

LoadingView.defaultProps = {
  isLoading: false,
  size: 'large'
}
