import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  SafeAreaView
} from 'react-native'
import { WebView } from 'react-native-webview'

type Props = {}
export default class Web extends Component {
  static navigatorStyle = global.Screens.PrimaryNavBar
  constructor(props) {
    super(props)

    this.state = {
      isLoading: true
    }
  }

  componentDidMount() {
    this.props.navigator.setTitle({ title: this.props.title })
  }

  _hideActivityIndicator() {
    this.setState({ isLoading: false })
  }

  _renderActivityIndicator() {
    return (
      <View style={[styles.container, styles.horizontal]}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  render() {
    return (
      <SafeAreaView style={styles.main}>
        <WebView
          source={{ uri: this.props.url }}
          startInLoadingState
          renderLoading={() => this._renderActivityIndicator()}
        />
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  main: {
    flex: 1
  },
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10
  }
})
