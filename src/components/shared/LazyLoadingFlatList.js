import React, { Component } from 'react'
import {
  View,
  Image,
  FlatList,
  StyleSheet,
  ActivityIndicator
} from 'react-native'

import { ListItem } from 'react-native-elements'

import LazyLoader, {
  PAGINATION_MODE_OFF
} from '../../components/shared/LazyLoader'

import Hr from './Hr'

import AuthManager from '../../utils/AuthManager'

export default class LazyLoadingFlatList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ...this.props,
      isInitialLoading: true
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps)
  }

  _renderFooter() {
    if (!this.state.isInitialLoading) {
      return null
    }

    return (
      <View
        style={{
          padding: 20
        }}
      >
        <ActivityIndicator animating size="large" />
      </View>
    )
  }

  refresh() {
    if (!this.state.isInitialLoading) {
      this.lazyLoader._refresh()
    }
  }

  lazyLoader() {
    console.log('a')
    return this.lazyLoader
  }

  render() {
    return (
      <LazyLoader
        mode={this.props.mode}
        ref={lazyLoader => (this.lazyLoader = lazyLoader)}
        endpoint={this.state.endpoint}
        headers={AuthManager.getHeaders()}
        params={this.props.params}
        onItemsUpdated={items => {
          this.setState({ data: items, isInitialLoading: false })
        }}
        onRefresh={() => {
          this.setState({ data: [], isInitialLoading: true })
        }}
      >
        <FlatList
          {...this.state}
          data={this.state.data}
          ListFooterComponent={this._renderFooter()}
          contentContainerStyle={this.props.contentContainerStyle}
        />
      </LazyLoader>
    )
  }
}

LazyLoadingFlatList.defaultProps = {
  isChecked: false,
  mode: 'cursor',
  contentContainerStyle: {
    paddingBottom: 200
  }
}

const styles = StyleSheet.create({
  separator: {
    marginVertical: 10
  }
})
