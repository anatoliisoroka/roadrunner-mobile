import React, { Component } from 'react'
import { View, Image, FlatList, ActivityIndicator } from 'react-native'
import Text from 'react-native-text'

import { ListItem } from 'react-native-elements'

import LazyLoader, {
  PAGINATION_MODE_OFF
} from '../../components/common/LazyLoader'

import AuthManager from '../../utils/AuthManager'
import Backend from '../../utils/Backend'

export default class LazyLoadingSearchableFlatList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ...this.props,
      isInitialLoading: true,
      localSearchTerm: '',
      filteredData: []
    }
  }

  componentWillReceiveProps(nextProps) {
    let search = false
    if (nextProps.searchTerm != this.state.searchTerm) {
      search = true
    }

    this.setState(nextProps, () => {
      if (search) {
        this._handleSearch(nextProps.searchTerm)
      }
    })
  }

  _handleSearch(searchTerm) {
    this.setState({ isInitialLoading: true })
    if (searchTerm == null || searchTerm == '') {
      filteredData = this.state.data
    } else {
      filteredData = this.props.getSearchResults(this.state.data, searchTerm)
    }
    this.setState({ filteredData, isInitialLoading: false })
  }

  _data() {
    if (this.state.searchTerm != null && this.state.searchTerm != '') {
      return this.state.filteredData
    } else {
      return this.state.data
    }
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

  render() {
    return (
      <LazyLoader
        ref={lazyLoader => (this.lazyLoader = lazyLoader)}
        endpoint={this.state.endpoint}
        headers={AuthManager.getHeaders()}
        mode={PAGINATION_MODE_OFF}
        onItemsUpdated={items => {
          this.setState({ data: items, isInitialLoading: false })
        }}
        onRefresh={() => {
          this.setState({ data: [], isInitialLoading: true })
        }}
      >
        <FlatList
          {...this.state}
          data={this._data()}
          ListFooterComponent={this._renderFooter()}
        />
      </LazyLoader>
    )
  }
}

LazyLoadingSearchableFlatList.defaultProps = {
  isChecked: false
}
