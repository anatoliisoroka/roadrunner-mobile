import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Animated,
  Easing,
  ScrollView,
  Dimensions
} from 'react-native'

import PropTypes from 'prop-types'
import PageScroller from './PageScroller'
import Button from 'apsl-react-native-button'
import PageControl from 'react-native-page-control'

const { width } = Dimensions.get('window')

type Props = {}
export default class Pager extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pages: props.pages
    }
  }

  _renderButton() {
    return (
      <Button
        style={{
          marginLeft: 40,
          marginRight: 40,
          marginTop: 20,
          marginBottom: 40,
          backgroundColor: global.Colors.Primary,
          borderRadius: 5,
          borderWidth: 0
        }}
        textStyle={{
          fontSize: 16,
          fontWeight: '800',
          color: global.Colors.White
        }}
        onPress={() => this.props._goTo()}
      >
        Done
      </Button>
    )
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <PageScroller
          pages={this.state.pages}
          onPageChanged={currentPage => {
            this.setState({ currentPage })
          }}
        />

        <PageControl
          style={{ marginBottom: 30, marginTop: 10 }}
          numberOfPages={this.state.pages.length}
          currentPage={this.state.currentPage}
          hidesForSinglePage
          pageIndicatorTintColor="#E0E0E0"
          currentPageIndicatorTintColor={global.Colors.Primary}
          indicatorStyle={{
            borderRadius: 5,
            borderColor: '#E0E0E0',
            borderWidth: 1
          }}
          currentIndicatorStyle={{ borderRadius: 5 }}
          indicatorSize={{ width: 10, height: 10 }}
        />

        {this._renderButton()}
      </View>
    )
  }
}

PageScroller.propTypes = {
  pages: PropTypes.array.isRequired
}
