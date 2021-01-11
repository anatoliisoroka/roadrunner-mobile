import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Image,
  Animated,
  Easing,
  ScrollView,
  Dimensions
} from 'react-native'

import PropTypes from 'prop-types'

import textStyles from '../../assets/css/text'
import screenStyles from '../../assets/css/screens'

const { width } = Dimensions.get('window')

type Props = {}
export default class PageScroller extends Component<Props> {
  constructor(props) {
    super(props)
    this.state = {
      progress: new Animated.Value(0),
      currentPage: 0,
      pages: props.pages
    }
  }
  handleScroll = event => {
    const x = event.nativeEvent.contentOffset.x
    var value = x / (width * (this.state.pages.length - 1))

    // clamp the value
    if (value < 0) {
      value = -value / 2
    } else if (value > 0.95) {
      value = 0.95
    }

    const progress = new Animated.Value(value)
    const currentPage = Math.round(x / width)

    if (this.state.currentPage != currentPage) {
      this.props.onPageChanged(currentPage)
    }
    this.setState({ progress, currentPage })
  }
  renderPages = () => {
    return this.state.pages.map((page, index) => {
      return (
        <View key={index}>
          <View
            style={{
              width: width,
              alignItems: 'center',
              marginTop: 30
            }}
          >
            <Image source={page.image} style={{ marginBottom: 0 }} />
            <Text
              style={[
                textStyles.appTitle,
                {
                  paddingLeft: 30,
                  paddingRight: 30
                }
              ]}
            >
              {page.title}
            </Text>
          </View>
        </View>
      )
    })
  }
  render() {
    return (
      <ScrollView
        contentContainerStyle={{
          justifyContent: 'center',
          alignItems: 'center'
        }}
        ref={scrollView => {
          this.scrollView = scrollView
        }}
        horizontal={true}
        pagingEnabled={true} // animates ScrollView to nearest multiple of it's own width
        showsHorizontalScrollIndicator={false}
        onScroll={this.handleScroll}
        scrollEventThrottle={32} // this will ensure that this ScrollView's onScroll prop is called no faster than 16ms between each function call
      >
        {this.renderPages()}
      </ScrollView>
    )
  }
}

PageScroller.propTypes = {
  onPageChanged: PropTypes.func.isRequired,
  pages: PropTypes.array.isRequired
}
