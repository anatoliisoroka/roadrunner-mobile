import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import Text from 'react-native-text'

import PropTypes from 'prop-types'

import { SearchBar } from 'react-native-elements'

const TYPING_TIMEOUT = 800
export default class SearchField extends Component {
  constructor(props) {
    super(props)
    this.state = {
      throttle: props.throttle,
      searchTerm: props.searchTerm
    }
    this.typingTimeout = 0
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps)
  }

  _onChangeText(searchTerm) {
    let { throttle } = this.state
    if (!throttle) {
      this.props.onChangeText(searchTerm)
      clearTimeout(this.typingTimeout)
      return
    }

    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout)
    }

    this.typingTimeout = setTimeout(() => {
      this.props.onChangeText(searchTerm)
    }, this.props.timeout)
  }

  _getSearchIconProps() {
    if (this.props.isSearching) {
      return {
        type: 'evilicon',
        name: 'spinner'
      }
    }
    return { name: 'search' }
  }

  render() {
    return (
      <SearchBar
        lightTheme
        containerStyle={[
          {
            backgroundColor: 'transparent',
            height: 32
          },
          this.props.containerStyle
        ]}
        inputContainerStyle={{ borderWidth: 0, margin: 0 }}
        inputStyle={[
          {
            backgroundColor: 'transparent',
            margin: 0,
            paddingTop: 4,
            borderRadius: 0
          },
          this.props.inputStyle
        ]}
        icon={{ ...this._getSearchIconProps(), style: { left: 8, top: 8 } }}
        placeholder={this.props.placeholder}
        onChangeText={searchTerm => {
          this.setState({ searchTerm })
          this._onChangeText(searchTerm)
        }}
        value={this.state.searchTerm}
        returnKeyType="search"
      />
    )
  }
}

SearchField.defaultProps = {
  onChangeText: () => {},
  throttle: true,
  timeout: TYPING_TIMEOUT,
  isSearching: false
}
